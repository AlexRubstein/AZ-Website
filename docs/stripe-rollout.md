# Future Stripe Rollout

Sanity stores editable product and donation campaign content. Stripe should handle checkout,
payment security, receipts, refunds, failed payments, and webhook events.

## Implementation Steps

1. Install the official Stripe SDK.
2. Add checkout session creation in `/api/stripe/create-checkout-session`.
3. Add signed webhook verification in `/api/stripe/webhook`.
4. Store Stripe price IDs on `product` and `donationCampaign`.
5. Test checkout, refunds, failed payment states, and fulfillment.
6. Document the client workflow before launch.
