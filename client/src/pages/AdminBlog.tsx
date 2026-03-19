import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
}

export default function AdminBlog() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { data: blogs, isLoading, refetch } = trpc.blog.list.useQuery();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenDialog = (blog?: any) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        content: blog.content,
        category: blog.category || "",
        date: blog.date,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error(t("common.error"));
      return;
    }

    try {
      // TODO: Implement save mutation
      toast.success(t("blog_admin.saveSuccess"));
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      // TODO: Implement delete mutation
      toast.success(t("blog_admin.deleteSuccess"));
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  return (
    <AdminLayout title={t("blog_admin.title")}>
      <div className="space-y-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-accent-lava text-sand-base hover:bg-accent-lava/90"
            >
              {t("blog_admin.create")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? t("blog_admin.edit") : t("blog_admin.create")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("blog_admin.articleTitle")}
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("blog_admin.articleTitle")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("blog_admin.slug")}
                </label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder={t("blog_admin.slug")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("blog_admin.excerpt")}
                </label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder={t("blog_admin.excerpt")}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("blog_admin.category")}
                </label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder={t("blog_admin.category")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("blog_admin.date")}
                </label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("blog_admin.content")}
                </label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder={t("blog_admin.content")}
                  rows={6}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseDialog}>
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-accent-lava text-sand-base hover:bg-accent-lava/90"
                >
                  {t("common.save")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="border border-text-main/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-light border-b border-text-main/10">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t("blog_admin.articleTitle")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t("blog_admin.category")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t("blog_admin.date")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t("common.edit")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <Loader2 className="inline animate-spin" />
                  </td>
                </tr>
              ) : blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-text-main/10 hover:bg-sand-light transition"
                  >
                    <td className="px-6 py-4 text-sm">{blog.title}</td>
                    <td className="px-6 py-4 text-sm">{blog.category || "-"}</td>
                    <td className="px-6 py-4 text-sm">{blog.date}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(blog)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-main/60">
                    {t("common.loading")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>{t("blog_admin.delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("blog_admin.confirmDelete")}
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("blog_admin.delete")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
