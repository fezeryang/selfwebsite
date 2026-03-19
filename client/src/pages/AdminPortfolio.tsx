import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

interface PortfolioFormData {
  title: string;
  slug: string;
  description: string;
  technologies: string;
  link: string;
  imageUrl: string;
  featured: boolean;
}

export default function AdminPortfolio() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    slug: "",
    description: "",
    technologies: "",
    link: "",
    imageUrl: "",
    featured: false,
  });

  const { data: projects, isLoading, refetch } = trpc.portfolio.list.useQuery();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  const handleOpenDialog = (project?: any) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description,
        technologies: project.technologies || "",
        link: project.link || "",
        imageUrl: project.imageUrl || "",
        featured: project.featured === 1,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        slug: "",
        description: "",
        technologies: "",
        link: "",
        imageUrl: "",
        featured: false,
      });
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.description) {
      toast.error(t("common.error"));
      return;
    }

    try {
      // TODO: Implement save mutation
      toast.success(t("portfolio_admin.saveSuccess"));
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
      toast.success(t("portfolio_admin.deleteSuccess"));
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  return (
    <AdminLayout title={t("portfolio_admin.title")}>
      <div className="space-y-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-accent-lava text-sand-base hover:bg-accent-lava/90"
            >
              {t("portfolio_admin.create")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? t("portfolio_admin.edit")
                  : t("portfolio_admin.create")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("portfolio_admin.projectTitle")}
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("portfolio_admin.projectTitle")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("portfolio_admin.slug")}
                </label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder={t("portfolio_admin.slug")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("portfolio_admin.description")}
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("portfolio_admin.description")}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("portfolio_admin.technologies")}
                </label>
                <Input
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="React, TypeScript, Tailwind CSS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("portfolio_admin.link")}
                </label>
                <Input
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("portfolio_admin.image")}
                </label>
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.featured}
                  onCheckedChange={handleCheckboxChange}
                />
                <label className="text-sm font-medium">
                  {t("portfolio_admin.featured")}
                </label>
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
                  {t("portfolio_admin.projectTitle")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t("portfolio_admin.technologies")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t("portfolio_admin.featured")}
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
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-text-main/10 hover:bg-sand-light transition"
                  >
                    <td className="px-6 py-4 text-sm">{project.title}</td>
                    <td className="px-6 py-4 text-sm text-text-main/60">
                      {project.technologies || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {project.featured === 1 ? "✓" : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(project)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(project.id)}
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
          <AlertDialogTitle>{t("portfolio_admin.delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("portfolio_admin.confirmDelete")}
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("portfolio_admin.delete")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
