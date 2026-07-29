# MongoDB Single-Node Replica-Set Runbook

Classes account promotion and demotion require MongoDB transactions. A
single-node replica set provides those guarantees without Docker.

## Before the change

1. Inventory every application using the MongoDB service and record its
   connection URI.
2. Take and verify a restorable `mongodump` backup.
3. Confirm adequate disk space and schedule a maintenance window.
4. Ensure MongoDB listens only on the intended private or loopback interfaces.

## Convert the existing service

Add a replica-set name to the host's existing `mongod.conf`:

```yaml
replication:
  replSetName: classes-rs
```

Restart the native MongoDB service with the host's service manager. Then connect
with `mongosh` over the existing authenticated local URI and initialize:

```javascript
rs.initiate({
  _id: "classes-rs",
  members: [{ _id: 0, host: "127.0.0.1:27017" }]
})
```

Do not use `localhost` if application URIs use another hostname. The member
address must be resolvable by every application that connects.

## Verify before enabling transfers

1. Wait for `rs.status()` to report the member as `PRIMARY`.
2. Add `replicaSet=classes-rs` to every affected MongoDB URI.
3. Restart one application at a time and verify its health/readiness endpoints.
4. Set `REQUIRE_ROLE_TRANSFER_TRANSACTIONS=true`.
5. Run the backend transaction integration test with a separate, non-production
   replica-set URI:

```bash
MONGODB_REPLICA_SET_TEST_URI="mongodb://.../?replicaSet=classes-rs" \
  npm run -w back-end test -- account-role-transfer.mongodb.spec.test.ts
```

6. Verify `/api/readyz` reports `components.roleTransfers.ok: true`.

If any application cannot reconnect, restore its original URI/configuration
before attempting an account promotion or demotion.
