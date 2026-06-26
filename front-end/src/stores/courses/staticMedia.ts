export const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";
export const LEGACY_STATIC_MEDIA_BASE = "https://static.junilearning.com";
const STATIC_MEDIA_URL_PATTERN =
	/https:\/\/(?:static\.classes\.jacobdanderson\.net|static\.junilearning\.com)\/[^\s<>"')\]]+/g;
export const PENDING_STATIC_MEDIA_NOTICE_PATTERN =
	/\b(?:pending media|reserved|placeholder|not currently available|class static host)\b/i;

export const KNOWN_PENDING_STATIC_MEDIA_FILENAMES = [
	"am_12_file_io_with_dictionaries.mp4",
	"js1_chatbot.mp4",
	"js1_division_facts.mp4",
	"js1_first_middle_last.mp4",
	"js1_mad_libs.mp4",
	"js1_project_1.mp4",
	"js1_project_2.mp4",
	"js1_supplemental_project_1.mp4",
	"js1_supplemental_project_2.mp4",
	"js1_supplemental_project_3.mp4",
	"js2_basic_shapes.png",
	"js2_happy_graphics.png",
	"js2_project_1.mp4",
	"js2_project_2.mp4",
	"js2_project_3.mp4",
	"js2_rainbow.png",
	"js2_snowman.png",
	"js2_supplemental_project_1.mp4",
	"js2_supplemental_project_2.mp4",
	"js2_supplemental_project_3.mp4",
	"js2_temperature_converter.mp4",
	"js3_code_your_own_adventure.mp4",
	"js3_color_mixer.mp4",
	"js3_elevator_limits.mp4",
	"js3_project_1.mp4",
	"js3_project_2.mp4",
	"js3_project_3.mp4",
	"js3_spreadsheet_width.mp4",
	"js3_supplemental_project_1.mp4",
	"js3_supplemental_project_2.mp4",
	"js3_supplemental_project_3.mp4",
	"js3_too_chicken_to_cross_the_road.mp4",
	"js3_weather_activities.mp4",
	"js3_which_shape.mp4",
	"js4_checkout_calculator.mp4",
	"js4_letter_square.mp4",
	"js4_loops_practice.mp4",
	"js4_nested_loops.mp4",
	"js4_paintball.png",
	"js4_project_1.mp4",
	"js4_project_2.mp4",
	"js4_project_3.mp4",
	"js4_supplemental_project_1.mp4",
	"js5_letter_guesser.mp4",
	"js5_mathematical_challenges.mp4",
	"js5_number_guesser.mp4",
	"js5_project_1.mp4",
	"js5_project_2.mp4",
	"js5_project_3.mp4",
	"js5_supplemental_project_1.mp4",
	"js5_supplemental_project_2.mp4",
	"js5_supplemental_project_3.mp4",
	"js6_caught_speeding.png",
	"js6_methods_practice.png",
	"js6_min_and_max.png",
	"js6_palindrome_checker.png",
	"js6_picasso.png",
	"js6_project_1.mp4",
	"js6_project_2.mp4",
	"js6_project_3.mp4",
	"js6_string_expander.mp4",
	"js6_supplemental_project_1.mp4",
	"js6_supplemental_project_2.mp4",
	"js7_airline_management.mp4",
	"js7_arithmetic_sequence.mp4",
	"js7_fortuneteller.mp4",
	"js7_high_score_list.mp4",
	"js7_lucky_array.mp4",
	"js7_practice_with_arraylists.mp4",
	"js7_practice_with_arrays.png",
	"js7_project_1.mp4",
	"js7_project_2.mp4",
	"js7_project_3.mp4",
	"js7_song_shuffler.mp4",
	"js7_string_to_array.png",
	"js7_supplemental_project_1.mp4",
	"js7_supplemental_project_2.mp4",
	"js7_supplemental_project_3.mp4",
	"js7_too_much_reversing.png",
	"js8_2d_array_to_string.png",
	"js8_grid_drawer.mp4",
	"js8_magic_square.png",
	"js8_practice_with_2d_arrays.png",
	"js8_square_of_squares.mp4",
	"js9_advanced_battleship.mp4",
	"js9_simple_battleship.mp4",
	"jss8_project_1.mp4",
	"jss8_project_2.mp4",
	"jss8_project_3.mp4",
	"jss8_supplemental_project_1.mp4",
	"jss8_supplemental_project_2.mp4",
	"jss8_supplemental_project_3.mp4",
	"jss9_project_1.mp4",
	"jss9_project_2.mp4",
	"jss10_project_1.mp4",
	"jss10_project_2.mp4",
	"jss10_project_3.mp4",
	"jss10_supplemental_project_1.mp4",
	"jss10_supplemental_project_2.mp4",
	"jss11_project_1.mp4",
	"jss11_project_2.mp4",
	"jss11_project_3.mp4",
	"jss11_supplemental_project_1.mp4",
	"jss12_project_1.mp4",
	"jss12_project_2.mp4",
	"jss12_project_3.mp4",
	"jss12_project_4.mp4",
	"jss12_supplemental_project_1.mp4",
	"jss13_project_1.mp4",
	"jss13_project_2.mp4",
	"jss13_project_3.mp4",
	"jss13_project_4.mp4",
	"jss13_supplemental_project_1.mp4",
	"jss13_supplemental_project_2.mp4",
	"jss14_project_1.mp4",
	"jss14_project_2.mp4",
	"jss14_project_3.mp4",
	"jss14_project_4.mp4",
	"jss14_supplemental_project_1.mp4",
	"jss14_supplemental_project_2.mp4",
	"jss15_project_1.mp4",
	"jss15_supplemental_project_1.mp4",
	"jss15_supplemental_project_2.mp4",
	"jss15_supplemental_project_3.mp4",
	"jss_check_in_1_project.mp4",
	"jss_check_in_2_project.mp4",
	"grs1_spirals.mp4",
	"grs1_turtle_exploration(1).mp4",
	"grs2_basic_shapes.mp4",
	"grs2_bullseye.mp4",
	"grs2_captain_american_shield.mp4",
	"grs2_minion.mp4",
	"grs2_more_shapes.mp4",
	"grs2_smiley_face.mp4",
	"grs2_taxi.mp4",
	"grs2_watermelon_slice.mp4",
	"grs3_awesome_angles.mp4",
	"grs3_debugging_practice.mp4",
	"grs3_random_bowtie.mp4",
	"grs3_random_walk.mp4",
	"grs3_surprise_me_square.mp4",
	"grs4_find_your_turtle.mp4",
	"grs4_fireworks.mp4",
	"grs4_into_the_void.mp4",
	"grs4_navigating_the_coordinate_plane.mp4",
	"grs4_out_of_the_void.mp4",
	"grs4_rainbow_ninja_star.mp4",
	"grs5_circle_of_circles.mp4",
	"grs5_pyramid.mp4",
	"grs5_rainbow_flower.mp4",
	"grs5_reverse_pyramid.mp4",
	"grs5_reverse_square_inception.mp4",
	"grs5_square_inception.mp4",
	"grs5_square_spiral.mp4",
	"grs6_dizzy_hexagon.mp4",
	"grs6_project_1.mp4",
	"grs6_project_2.mp4",
	"grs6_rainbow_square_inception.mp4",
	"grs6_randomly_random_shapes.mp4",
	"grs6_snowflake.mp4",
	"grs6_spiral_staircase.mp4",
	"grs7_any_shape_staircase.mp4",
	"grs7_debugging_functions.mp4",
	"grs7_project_1.mp4",
	"grs7_square_inception_with_functions.mp4",
	"grs7_winter_wonderland.gif",
	"grs7_zigzag.mp4",
	"grs8_etch_a_sketch.gif",
	"grs8_fruit_stand.gif",
	"grs8_picasso_game.gif",
	"grs8_polka_dot_game.gif",
	"grs8_project_1.mp4",
	"grs8_project_2.mp4",
	"grs8_project_3.mp4",
	"grs9_polkadots.mp4",
	"grs9_project_1.mp4",
	"grs9_random_age.gif",
	"grs9_surprise_shape.gif",
	"grs9_turtle_launch.gif",
	"grs9_turtle_race.gif",
	"grs10_bouncy_ball_room.gif",
	"grs10_debugging_practice.gif",
	"grs10_rainbow_path.gif",
	"grs10_random_number_lists.gif",
	"grs10_turtle_launch_with_lists.gif",
	"grs10_which_way_turtles.gif",
	"grs11_light_the_stars.gif",
	"grs11_project_1.mp4",
	"grs11_stay_inbounds.gif",
	"grs11_turtle_collision.gif",
	"grs12_fidget_spinner.gif",
	"grs12_list_exploration.mp4",
	"grs12_pong.gif",
	"grs12_snake.gif",
	"grs12_space_eater.gif",
	"grs12_target_practice.gif",
	"grs12_turtle_run.gif",
	"grs13_dodgeball.mp4",
	"grs13_fluid_motion.mp4",
	"grs13_perpetual_motion.mp4",
	"biomod1pro1im1.jpg",
	"biomod1pro1im2.jpg",
	"biomod2pro1im1.png",
	"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png",
	"ent3_project2_0.png",
	"ent3_project2_1.png",
	"ent5_project1_0.png",
	"inv3_0.png",
	"jor2_disact_plotempty.png",
	"leb16_concept1_0.png",
	"mfb10_concept1_0.png",
	"module_project_1_0.png",
	"pf5_concept1_1.png",
	"pf5_concept1_2.png",
	"pf5_concept1_3.png",
	"pf5_concept1_4.png",
	"pf5_concept1_5.png",
	"pf5_concept1_6.png",
	"paa_kickoff_0.png",
	"paa_kickoff_1.png",
	"pab5_0.png",
	"pab14_0.png",
	"pab22_0.png",
	"ted_ed_release.pdf",
	"UB1.png",
	"UB2.png",
	"UB3.png",
	"UB4.png",
	"UB5.png",
	"UB6.png",
	"missionTitle2.png",
	"nextStepTitle.png",
	"WhileLoopsExploration(1).mp4",
	"wyb1_proj1_plotempty.png"
] as const;

const knownPendingStaticMedia = new Set<string>(
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES
);

function encodeStaticMediaCharacter(character: string) {
	return `%${character.charCodeAt(0).toString(16).toUpperCase()}`;
}

function staticMediaPathSegment(filename: string) {
	return encodeURIComponent(filename).replace(
		/[!'()*]/g,
		encodeStaticMediaCharacter
	);
}

export function staticMediaUrl(filename: string) {
	return `${STATIC_MEDIA_BASE}/${staticMediaPathSegment(filename)}`;
}

function trimStaticMediaUrl(url: string) {
	const trimmed = url.replace(/[.,;:!?]+$/g, "");
	return {
		trailing: url.slice(trimmed.length),
		url: trimmed
	};
}

export function staticMediaFilename(url: string) {
	try {
		const pathname = new URL(url).pathname;
		return decodeURIComponent(
			pathname.split("/").filter(Boolean).pop() || pathname || url
		);
	} catch {
		return url;
	}
}

export function isStaticMediaUrl(url: string) {
	try {
		return new URL(url).origin === STATIC_MEDIA_BASE;
	} catch {
		return false;
	}
}

export function isLegacyStaticMediaUrl(url: string) {
	try {
		return new URL(url).origin === LEGACY_STATIC_MEDIA_BASE;
	} catch {
		return false;
	}
}

export function canonicalStaticMediaUrl(url: string) {
	if (isStaticMediaUrl(url)) return url;
	if (isLegacyStaticMediaUrl(url))
		return staticMediaUrl(staticMediaFilename(url));
	return null;
}

export function isKnownPendingStaticMedia(filename: string) {
	return knownPendingStaticMedia.has(filename);
}

export function isKnownPendingStaticMediaUrl(url: string) {
	return (
		!!canonicalStaticMediaUrl(url) &&
		isKnownPendingStaticMedia(staticMediaFilename(url))
	);
}

export function staticMediaUrlsFromText(text: string) {
	return [...text.matchAll(STATIC_MEDIA_URL_PATTERN)]
		.map(match => trimStaticMediaUrl(match[0]).url)
		.map(canonicalStaticMediaUrl)
		.filter((url): url is string => Boolean(url));
}

export function normalizeStaticMediaUrlsInText(text: string) {
	return text.replace(STATIC_MEDIA_URL_PATTERN, rawUrl => {
		const { trailing, url } = trimStaticMediaUrl(rawUrl);
		return `${canonicalStaticMediaUrl(url) ?? url}${trailing}`;
	});
}

export function pendingStaticMediaNotice(filename: string) {
	return `**Pending media:** The original static asset \`${filename}\` is not currently available. Space is reserved for it at ${staticMediaUrl(filename)} so the asset can be added later without changing this course link.`;
}

export function hasPendingStaticMediaNotice(content: string, filename: string) {
	return (
		content.includes(filename) &&
		content.includes(staticMediaUrl(filename)) &&
		PENDING_STATIC_MEDIA_NOTICE_PATTERN.test(content)
	);
}

export function withPendingStaticMediaNotice(
	content: string,
	filename: string
) {
	if (!isKnownPendingStaticMedia(filename)) {
		return content;
	}

	if (hasPendingStaticMediaNotice(content, filename)) {
		return content;
	}

	return `${content}\n\n${pendingStaticMediaNotice(filename)}`;
}
