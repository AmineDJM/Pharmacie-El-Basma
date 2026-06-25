import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/ui';
import { ArticleForm } from '@/components/admin/forms/article-form';
import { prisma } from '@/lib/db';

type Params = Promise<{ id: string }>;

export default async function EditArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } }).catch(() => null);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Modifier l’article" description={article.title} />
      <ArticleForm article={article} />
    </div>
  );
}
