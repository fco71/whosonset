# Social and Crew Interaction Upgrade Overview

## App Context

My Film Jobs connects film professionals through crew discovery, project work, jobs, social following, messaging, and notifications. The current social surface includes:

- Crew discovery at `/crew` and public crew previews at `/crew-public`.
- Follow requests and accepted follow relationships.
- Social tabs for connections, requests, discover, and notifications.
- Direct messaging through `/chat`.
- Saved crew favorites for logged-in users.

## Problems Addressed

The social experience had several interaction gaps:

- Incoming and sent follow requests were mixed in one list, which becomes hard to scan with dozens of requests.
- Incoming requests only offered Accept, so old/test requests could not be ignored from the UI.
- Sent request cards did not have a compact organization for larger queues.
- Social discovery could include the current user, which allowed awkward self-follow attempts.
- The Social page notifications tab was a placeholder even though the navigation notification center was functional.
- The Social page messaging helper flow existed but did not actually navigate to a conversation.
- The crew page default order was labeled as popularity/relevance, while a clearer default is newest profiles first.
- Public crew preview had no explicit ordering.

## Implemented Upgrades

### Follow Requests

- Split request management into separate Incoming and Sent sections.
- Add Ignore to incoming requests so old/test requests can be archived out of the active list.
- Keep Cancel on sent requests.
- Use compact list organization with counts and clear empty states.
- Preserve request history by marking ignored requests as rejected rather than deleting them.

### Social Discovery and Messaging

- Hide the signed-in user from Discover.
- Prevent self-follow at the service layer.
- Show relationship-aware actions in Discover: following, pending request, connected, or follow.
- Navigate directly to `/chat?user=:id` when starting a message.
- Replace the placeholder notifications tab with the same live notification data used elsewhere.

### Crew Ordering

- Change authenticated crew default sort to Newest first.
- Keep Recommended as an optional sort for availability/profile-completeness ranking.
- Add a Favorites sort for logged-in users.
- Apply explicit newest-first ordering to public crew previews.

## Future Upgrades

Recommended follow-up improvements:

- Track frequent interactions with `lastMessageAt`, conversation count, or profile views, then add a true Frequent sort.
- Rename the social model from Follow to Connect if accepted requests continue creating reciprocal relationships.
- Add bulk actions for large request queues, such as Ignore all selected and Cancel selected.
- Add request age labels and filters such as Last 7 days, Older than 30 days, and Test accounts.
- Move shared user-card and notification-card rendering into reusable components.
