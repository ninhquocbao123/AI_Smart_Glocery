import Link from "next/link";
import photos from "@/data/catalogPhotoCredits.json";

export default function PhotoCreditsPage() {
  return <main className="max-w-5xl mx-auto space-y-8">
    <header className="border-b border-outline-variant pb-6 space-y-3">
      <Link href="/meal-plan" className="text-sm text-primary">← Danh mục món ăn</Link>
      <h1 className="text-3xl font-bold">Nguồn hình ảnh</h1>
      <p className="text-on-surface-variant">Ảnh tham khảo giúp nhận biết món ăn và nguyên liệu. Cách trình bày, bao bì và thương hiệu trong ảnh có thể khác sản phẩm tại cửa hàng. Ảnh thuộc các tác giả và đơn vị được dẫn nguồn bên dưới.</p>
    </header>
    {([['recipe','Món ăn'],['deal','Sản phẩm ưu đãi'],['ingredient','Nguyên liệu']] as const).map(([kind,title])=><section key={kind} className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="grid sm:grid-cols-2 gap-x-8">
        {photos.filter(photo=>photo.kind===kind).map(photo=><li key={photo.id} className="flex justify-between gap-4 py-3 border-b border-outline-variant text-sm">
          <span>{photo.name}</span>
          <a href={photo.source} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 shrink-0" aria-label={`Nguồn ảnh ${photo.name}`}>Xem nguồn ↗</a>
        </li>)}
      </ul>
    </section>)}
  </main>;
}
