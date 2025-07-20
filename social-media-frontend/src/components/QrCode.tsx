import qrCode from "../assets/qr-code.png"

export const QrCode = () => {
  return (
    <div className="mt-8 flex gap-1 h-fit">
      <img src={qrCode} alt="qr-code" className="h-20 w-20" />
      <div className="text-start flex flex-col justify-between py-2">
        <div>
          <h3 className="font-semibold">Quick Login with QR code</h3>
          <p className="text-gray-500 text-xs">Use your phone's camera</p>
        </div>
        <a href="/qr-code" className="text-xs text-primary hover:underline ">Learn more</a>
      </div>
    </div>
  )
}
