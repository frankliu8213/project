interface StripeButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

export function StripeButton({ buyButtonId, publishableKey }: StripeButtonProps) {
  return (
    <div className="w-full stripe-button-container">
      <stripe-buy-button
        buy-button-id={buyButtonId}
        publishable-key={publishableKey}
      />
    </div>
  );
}