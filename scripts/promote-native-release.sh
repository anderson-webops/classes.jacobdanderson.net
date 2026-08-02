#!/usr/bin/env bash
set -euo pipefail

umask 022

classes_source_dir="$(pwd -P)"
classes_release_root="/srv/classes.jacobdanderson.net"
classes_candidate=""
classes_api_service="classes-api.service"
classes_nginx_service="nginx.service"
classes_work_dir=""
classes_preserve_work=false

usage() {
	printf '%s\n' \
		"Usage: $0 --candidate DIR [--source DIR] [--release-root DIR]" \
		"          [--api-service UNIT] [--nginx-service UNIT]"
}

while (( $# > 0 )); do
	case "$1" in
		--source) classes_source_dir="${2:-}"; shift 2 ;;
		--release-root) classes_release_root="${2:-}"; shift 2 ;;
		--candidate) classes_candidate="${2:-}"; shift 2 ;;
		--api-service) classes_api_service="${2:-}"; shift 2 ;;
		--nginx-service) classes_nginx_service="${2:-}"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) usage >&2; exit 2 ;;
	esac
done

cleanup() {
	if [[ "$classes_preserve_work" != "true" \
		&& -n "$classes_work_dir" && "$classes_work_dir" == /var/tmp/classes-native-promote.* \
		&& -d "$classes_work_dir" ]]; then
		rm -rf -- "$classes_work_dir"
	fi
}
trap cleanup EXIT

[[ ${EUID:-$(id -u)} -eq 0 ]] \
	|| { printf '%s\n' "Promote native releases as root." >&2; exit 1; }
[[ "$classes_release_root" == /* && "$classes_release_root" != "/" && "$classes_release_root" != "/srv" ]] \
	|| { printf '%s\n' "--release-root must be a narrow absolute directory." >&2; exit 1; }
[[ "$classes_api_service" =~ ^[a-zA-Z0-9_.@-]+[.]service$ \
	&& "$classes_nginx_service" =~ ^[a-zA-Z0-9_.@-]+[.]service$ ]] \
	|| { printf '%s\n' "Service unit names are invalid." >&2; exit 1; }
for classes_command in awk basename chmod chown cmp curl dirname find git grep install ln mktemp mv nginx node readlink realpath rm sleep stat systemctl unlink; do
	command -v "$classes_command" >/dev/null 2>&1 \
		|| { printf '%s\n' "Missing required command: $classes_command" >&2; exit 1; }
done

classes_source_dir="$(realpath "$classes_source_dir")"
classes_release_root="$(realpath "$classes_release_root")"
classes_candidate_root="$classes_release_root/releases/.candidates"
[[ -d "$classes_candidate_root" && ! -L "$classes_candidate_root" ]] \
	|| { printf '%s\n' "The real .candidates directory is missing." >&2; exit 1; }
[[ -n "$classes_candidate" && -d "$classes_candidate" && ! -L "$classes_candidate" ]] \
	|| { printf '%s\n' "--candidate must identify a real directory." >&2; exit 1; }
classes_candidate="$(realpath "$classes_candidate")"
[[ "$classes_candidate" == "$classes_candidate_root/"* ]] \
	|| { printf '%s\n' "Candidate must remain inside the managed .candidates directory." >&2; exit 1; }
[[ "$(git -C "$classes_source_dir" rev-parse --is-inside-work-tree 2>/dev/null || true)" == "true" \
	&& -z "$(git -C "$classes_source_dir" status --porcelain --untracked-files=normal)" ]] \
	|| { printf '%s\n' "--source must be a clean Git checkout." >&2; exit 1; }

node "$classes_source_dir/scripts/verify-native-release.mjs" "$classes_candidate"
classes_manifest="$classes_candidate/.classes-native-release.json"
classes_tag="$(node -e 'const m=require(process.argv[1]); process.stdout.write(m.tag)' "$classes_manifest")"
classes_revision="$(node -e 'const m=require(process.argv[1]); process.stdout.write(m.revision)' "$classes_manifest")"
classes_release_id="$(node -e 'const m=require(process.argv[1]); process.stdout.write(m.releaseId)' "$classes_manifest")"
[[ "$(basename "$classes_candidate")" == "$classes_release_id" ]] \
	|| { printf '%s\n' "Candidate directory does not match its release ID." >&2; exit 1; }
[[ "$(git -C "$classes_source_dir" rev-parse HEAD)" == "$classes_revision" \
	&& "$(git -C "$classes_source_dir" cat-file -t "refs/tags/$classes_tag" 2>/dev/null || true)" == "tag" \
	&& "$(git -C "$classes_source_dir" rev-parse "${classes_tag}^{}")" == "$classes_revision" ]] \
	|| { printf '%s\n' "Source checkout does not match the candidate's annotated tag." >&2; exit 1; }

for classes_release_input in \
	package.json \
	package-lock.json \
	front-end/package.json \
	back-end/package.json \
	back-end/package-lock.json \
	scripts/verify-native-release.mjs \
	deploy/native/api.env.example \
	deploy/native/host-nginx.conf.example \
	deploy/native/classes-http-maps.conf \
	deploy/native/classes-static-headers.conf \
	deploy/native/classes-server-policy.conf \
	deploy/native/classes-api.service; do
	cmp --silent "$classes_source_dir/$classes_release_input" "$classes_candidate/$classes_release_input" \
		|| { printf '%s\n' "Candidate input differs from tagged source: $classes_release_input" >&2; exit 1; }
done
[[ -z "$(find "$classes_candidate" -perm -002 -print -quit)" ]] \
	|| { printf '%s\n' "Candidate contains world-writable content." >&2; exit 1; }

classes_final_release="$classes_release_root/releases/$classes_release_id"
[[ ! -e "$classes_final_release" && ! -L "$classes_final_release" ]] \
	|| { printf '%s\n' "That exact immutable release already exists." >&2; exit 1; }
classes_current_link="$classes_release_root/current"
classes_previous_link="$classes_release_root/previous"
[[ ! -e "$classes_current_link" || -L "$classes_current_link" ]] \
	|| { printf '%s\n' "Current release path must be a symlink." >&2; exit 1; }
[[ ! -e "$classes_previous_link" || -L "$classes_previous_link" ]] \
	|| { printf '%s\n' "Previous release path must be a symlink." >&2; exit 1; }
classes_previous_target="$(readlink -f "$classes_current_link" 2>/dev/null || true)"
if [[ -L "$classes_current_link" && -z "$classes_previous_target" ]]; then
	printf '%s\n' "Current release symlink is dangling." >&2
	exit 1
fi
if [[ -n "$classes_previous_target" && "$classes_previous_target" != "$classes_release_root/releases/"* ]]; then
	printf '%s\n' "Current release points outside the managed release directory." >&2
	exit 1
fi
if [[ "$classes_previous_target" == "$classes_candidate_root/"* ]]; then
	printf '%s\n' "Current release must not point into the candidate directory." >&2
	exit 1
fi
if [[ -n "$classes_previous_target" ]]; then
	[[ -d "$classes_previous_target" && "$(stat -c '%u' "$classes_previous_target")" == "0" \
		&& -z "$(find "$classes_previous_target" ! -user root -print -quit)" \
		&& -z "$(find "$classes_previous_target" -perm /022 -print -quit)" ]] \
		|| { printf '%s\n' "Current release is not a root-owned, immutable release." >&2; exit 1; }
fi

classes_sources=(
	"$classes_candidate/deploy/native/classes-http-maps.conf"
	"$classes_candidate/deploy/native/classes-static-headers.conf"
	"$classes_candidate/deploy/native/classes-server-policy.conf"
	"$classes_candidate/deploy/native/classes-api.service"
)
classes_targets=(
	"/etc/nginx/snippets/classes-http-maps.conf"
	"/etc/nginx/snippets/classes-static-headers.conf"
	"/etc/nginx/snippets/classes-server-policy.conf"
	"/etc/systemd/system/classes-api.service"
)
for classes_target in "${classes_targets[@]}"; do
	[[ -d "$(dirname "$classes_target")" ]] \
		|| { printf '%s\n' "Missing installation directory for $classes_target" >&2; exit 1; }
	[[ ! -e "$classes_target" || ( -f "$classes_target" && ! -L "$classes_target" ) ]] \
		|| { printf '%s\n' "Installed artifact must be a regular file: $classes_target" >&2; exit 1; }
done

classes_work_dir="$(mktemp -d /var/tmp/classes-native-promote.XXXXXX)"
for classes_index in "${!classes_targets[@]}"; do
	classes_target="${classes_targets[$classes_index]}"
	if [[ -f "$classes_target" ]]; then
		install -m 0644 "$classes_target" "$classes_work_dir/$classes_index.previous"
	else
		: > "$classes_work_dir/$classes_index.missing"
	fi
done

atomic_install() {
	local classes_from="$1"
	local classes_to="$2"
	local classes_next="${classes_to}.next.$$"
	install -o root -g root -m 0644 "$classes_from" "$classes_next"
	mv -Tf -- "$classes_next" "$classes_to"
}

atomic_link() {
	local classes_to="$1"
	local classes_link="$2"
	local classes_next="${classes_link}.next.$$"
	ln -s -- "$classes_to" "$classes_next"
	mv -Tf -- "$classes_next" "$classes_link"
}

restore_previous() {
	if [[ -n "$classes_previous_target" ]]; then
		atomic_link "$classes_previous_target" "$classes_current_link" || return 1
	else
		[[ ! -L "$classes_current_link" ]] || unlink "$classes_current_link" || return 1
		systemctl stop "$classes_api_service" >/dev/null 2>&1 || true
	fi
	for classes_index in "${!classes_targets[@]}"; do
		classes_target="${classes_targets[$classes_index]}"
		if [[ -f "$classes_work_dir/$classes_index.previous" ]]; then
			atomic_install "$classes_work_dir/$classes_index.previous" "$classes_target" || return 1
		else
			rm -f -- "$classes_target" || return 1
		fi
	done
	systemctl daemon-reload || return 1
	if [[ -n "$classes_previous_target" ]]; then
		systemctl restart "$classes_api_service" || return 1
	fi
	nginx -t || return 1
	systemctl reload "$classes_nginx_service" || return 1
}

header_value() {
	local classes_headers="$1"
	local classes_name="$2"
	awk -v wanted="$classes_name" \
		'index($0, ":") > 0 {
			name = substr($0, 1, index($0, ":") - 1)
			if (tolower(name) == tolower(wanted)) {
				value = substr($0, index($0, ":") + 1)
				sub(/^[[:space:]]+/, "", value)
				sub(/\r$/, "", value)
				print value
			}
		}' \
		"$classes_headers"
}

require_one_header() {
	local classes_headers="$1"
	local classes_name="$2"
	local classes_expected="$3"
	local classes_actual
	classes_actual="$(header_value "$classes_headers" "$classes_name")"
	[[ "$classes_actual" == "$classes_expected" ]]
}

require_one_header_containing() {
	local classes_headers="$1"
	local classes_name="$2"
	local classes_expected_fragment="$3"
	local classes_actual
	classes_actual="$(header_value "$classes_headers" "$classes_name")"
	[[ -n "$classes_actual" && "$classes_actual" != *$'\n'* \
		&& "$classes_actual" == *"$classes_expected_fragment"* ]]
}

capture_https() {
	local classes_path="$1"
	local classes_body="$2"
	local classes_headers="$3"
	curl --silent --show-error --max-time 10 --noproxy '*' \
		--resolve "classes.jacobdanderson.net:443:127.0.0.1" \
		-D "$classes_headers" \
		-o "$classes_body" \
		-w '%{http_code}' \
		"https://classes.jacobdanderson.net$classes_path"
}

capture_http() {
	local classes_path="$1"
	local classes_body="$2"
	local classes_headers="$3"
	curl --silent --show-error --max-time 10 --noproxy '*' \
		--resolve "classes.jacobdanderson.net:80:127.0.0.1" \
		-D "$classes_headers" \
		-o "$classes_body" \
		-w '%{http_code}' \
		"http://classes.jacobdanderson.net$classes_path"
}

require_https_redirect() {
	local classes_path="$1"
	local classes_target="$2"
	local classes_status
	classes_status="$(
		capture_https \
			"$classes_path" \
			"$classes_work_dir/redirect.body" \
			"$classes_work_dir/redirect.headers"
	)"
	[[ "$classes_status" == "308" ]]
	require_one_header \
		"$classes_work_dir/redirect.headers" \
		"Location" \
		"https://classes.jacobdanderson.net$classes_target"
}

verify_nginx_includes() {
	local classes_include_count classes_target
	local classes_nginx_dump="$classes_work_dir/nginx.dump"
	nginx -T >"$classes_nginx_dump" 2>&1
	for classes_target in \
		/etc/nginx/snippets/classes-http-maps.conf \
		/etc/nginx/snippets/classes-static-headers.conf \
		/etc/nginx/snippets/classes-server-policy.conf; do
		classes_include_count="$(
			grep -Fxc "# configuration file $classes_target:" "$classes_nginx_dump" || true
		)"
		[[ "$classes_include_count" == "1" ]]
	done
}

smoke_release() {
	local classes_http_path classes_status
	classes_http_path="/__native-http-redirect-$classes_revision?probe=1"
	classes_status="$(capture_http "$classes_http_path" "$classes_work_dir/http.body" "$classes_work_dir/http.headers")"
	[[ "$classes_status" == "301" ]]
	require_one_header \
		"$classes_work_dir/http.headers" \
		"Location" \
		"https://classes.jacobdanderson.net$classes_http_path"
	require_https_redirect "/index.html?probe=1" "/?probe=1"
	require_https_redirect "/courses/index.html?probe=1" "/courses/?probe=1"
	require_https_redirect "/ide.html?probe=1" "/ide/?probe=1"
	require_https_redirect \
		"/admin/student-management.html?probe=1" \
		"/admin/student-management/?probe=1"

	classes_status="$(capture_https / "$classes_work_dir/root.body" "$classes_work_dir/root.headers")"
	[[ "$classes_status" == "200" ]]
	cmp --silent "$classes_work_dir/root.body" "$classes_final_release/front-end/dist/index.html"
	require_one_header "$classes_work_dir/root.headers" "Cross-Origin-Opener-Policy" "same-origin"
	require_one_header "$classes_work_dir/root.headers" "Cross-Origin-Resource-Policy" "same-origin"
	require_one_header "$classes_work_dir/root.headers" "X-Frame-Options" "DENY"
	require_one_header "$classes_work_dir/root.headers" "X-Content-Type-Options" "nosniff"
	require_one_header "$classes_work_dir/root.headers" "Referrer-Policy" "strict-origin-when-cross-origin"
	require_one_header "$classes_work_dir/root.headers" "Permissions-Policy" "camera=(), geolocation=(), microphone=()"
	require_one_header "$classes_work_dir/root.headers" "Strict-Transport-Security" "max-age=31536000; includeSubDomains"
	require_one_header "$classes_work_dir/root.headers" "Cache-Control" "no-cache"
	require_one_header_containing "$classes_work_dir/root.headers" "Content-Security-Policy" "frame-ancestors 'none'"

	classes_status="$(capture_https /api/readyz "$classes_work_dir/ready.body" "$classes_work_dir/ready.headers")"
	[[ "$classes_status" == "200" ]]
	[[ "$(header_value "$classes_work_dir/ready.headers" "Content-Type")" == application/json* ]]
	[[ "$(header_value "$classes_work_dir/ready.headers" "Cache-Control")" == *"no-store"* ]]
	require_one_header "$classes_work_dir/ready.headers" "Cross-Origin-Opener-Policy" "same-origin"
	require_one_header "$classes_work_dir/ready.headers" "Cross-Origin-Resource-Policy" "same-origin"
	require_one_header "$classes_work_dir/ready.headers" "X-Frame-Options" "DENY"
	require_one_header "$classes_work_dir/ready.headers" "X-Content-Type-Options" "nosniff"
	require_one_header "$classes_work_dir/ready.headers" "Referrer-Policy" "no-referrer"
	require_one_header_containing "$classes_work_dir/ready.headers" "Content-Security-Policy" "default-src 'none'"
	require_one_header_containing "$classes_work_dir/ready.headers" "Content-Security-Policy" "frame-ancestors 'none'"
	node -e 'const b=JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")); if (b.ready !== true || b.components?.db?.ok !== true || b.components?.db?.state !== 1) process.exit(1)' "$classes_work_dir/ready.body"

	for classes_path in \
		"/404.html" \
		"/courses.html" \
		"/__native-release-missing-$classes_revision" \
		"/.env" \
		"/.vite/ssr-manifest.json" \
		"/release.json" \
		"/.classes-native-release.json"; do
		classes_status="$(capture_https "$classes_path" "$classes_work_dir/not-found.body" "$classes_work_dir/not-found.headers")"
		[[ "$classes_status" == "404" ]]
		cmp --silent "$classes_work_dir/not-found.body" "$classes_final_release/front-end/dist/404.html"
		require_one_header "$classes_work_dir/not-found.headers" "X-Robots-Tag" "noindex, nofollow"
	done

	for classes_path in \
		"/api" \
		"/api/release" \
		"/api/__native-release-missing-$classes_revision"; do
		classes_status="$(capture_https "$classes_path" "$classes_work_dir/api-404.body" "$classes_work_dir/api-404.headers")"
		[[ "$classes_status" == "404" ]]
		[[ "$(header_value "$classes_work_dir/api-404.headers" "Content-Type")" == application/json* ]]
		[[ "$(header_value "$classes_work_dir/api-404.headers" "Cache-Control")" == *"no-store"* ]]
		require_one_header "$classes_work_dir/api-404.headers" "Cross-Origin-Opener-Policy" "same-origin"
		require_one_header "$classes_work_dir/api-404.headers" "Cross-Origin-Resource-Policy" "same-origin"
		node -e 'const b=JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")); if (Object.keys(b).join(",") !== "message" || b.message !== "Not found") process.exit(1)' "$classes_work_dir/api-404.body"
	done
}

# Move the verified candidate to its root-owned immutable name before any live
# configuration changes. A failed activation leaves it available for review.
chown -R root:root "$classes_candidate"
chmod -R go-w "$classes_candidate"
mv -- "$classes_candidate" "$classes_final_release"
node "$classes_source_dir/scripts/verify-native-release.mjs" "$classes_final_release"
[[ "$(stat -c '%u' "$classes_final_release")" == "0" \
	&& -z "$(find "$classes_final_release" ! -user root -print -quit)" \
	&& -z "$(find "$classes_final_release" -perm /022 -print -quit)" ]] \
	|| { printf '%s\n' "Final release is not root-owned and immutable." >&2; exit 1; }

if ! (
	set -e
	for classes_index in "${!classes_targets[@]}"; do
		atomic_install \
			"$classes_final_release/deploy/native/$(basename "${classes_sources[$classes_index]}")" \
			"${classes_targets[$classes_index]}"
	done
	nginx -t
	verify_nginx_includes
	systemctl daemon-reload
	atomic_link "$classes_final_release" "$classes_current_link"
	systemctl restart "$classes_api_service"
	systemctl reload "$classes_nginx_service"
	classes_ready=false
	for _classes_attempt in {1..30}; do
		if curl --fail --silent --show-error --max-time 2 --noproxy '*' http://127.0.0.1:3008/readyz >/dev/null; then
			classes_ready=true
			break
		fi
		sleep 1
	done
	[[ "$classes_ready" == "true" ]]
	smoke_release
); then
	if restore_previous; then
		printf '%s\n' "Native activation failed; the prior release and configuration were restored." >&2
	else
		classes_preserve_work=true
		printf 'Native activation and automatic rollback failed; operator recovery is required. Preserved backups: %s\n' \
			"$classes_work_dir" >&2
	fi
	exit 1
fi

if [[ -n "$classes_previous_target" && "$classes_previous_target" != "$classes_final_release" ]]; then
	atomic_link "$classes_previous_target" "$classes_previous_link"
fi
printf 'Activated classes.jacobdanderson.net %s at %s.\n' "$classes_tag" "$classes_revision"
