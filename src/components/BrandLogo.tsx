import Image from "next/image";

export default function BrandLogo({ size = 56 }: { size?: number }) {
  return <Image src="/images/brand/logo.png" alt="AI Smart Grocery" width={size} height={size} className="shrink-0 object-contain" style={{ width: size, height: size }} />;
}
