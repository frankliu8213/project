interface PaymentButtonsProps {
  isPremium: boolean;
  paymentLink: string;
  onReset: () => void;
}

export const PaymentButtons = ({ isPremium, paymentLink, onReset }: PaymentButtonsProps) => {
  return (
    <>
      {!isPremium && (
        <a href={paymentLink} className="upgrade-button">
          升级到高级账户
        </a>
      )}
      <button onClick={onReset} className="reset-button">
        恢复
      </button>
    </>
  )
} 