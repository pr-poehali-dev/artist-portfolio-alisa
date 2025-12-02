import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../backend/func2url.json';

interface ProjectImage {
  id?: number;
  url: string;
  position: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: ProjectImage[];
}

const API_URL = funcUrls.projects;
const UPLOAD_URL = funcUrls.upload;

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRefs = useRef<{ [key: number]: HTMLInputElement }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить проекты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          });
          const data = await response.json();
          if (data.success) {
            resolve(data.url);
          } else {
            reject(new Error('Upload failed'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCoverUpload = async (projectId: string, file: File) => {
    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          image_url: imageUrl,
          type: 'cover',
        }),
      });

      await loadProjects();
      
      toast({
        title: 'Успешно',
        description: 'Обложка обновлена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить обложку',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (projectId: string, file: File, position: number) => {
    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          image_url: imageUrl,
          type: 'gallery',
          position,
        }),
      });

      const response = await fetch(`${API_URL}?project_id=${projectId}`);
      const updatedProject = await response.json();
      setSelectedProject(updatedProject);
      
      await loadProjects();
      
      toast({
        title: 'Успешно',
        description: 'Фото добавлено в галерею',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedProject) {
            handleCoverUpload(selectedProject.id, file);
          }
        }}
      />
      
      <section className="py-24 px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-serif mb-6 text-foreground tracking-tight">
            Алиса Меликова
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Российский художник, живущая и работающая в Москве. Активно сотрудничает с ведущими режиссерами. 
            Работы как в театральных постановках, так и в кинематографе.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Поиск спектакля..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif mb-12 text-center">Проекты</h2>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Проекты не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="group cursor-pointer hover-scale overflow-hidden border-0 shadow-lg"
                  onClick={() => setSelectedProject(project)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={project.coverImage} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Icon name="Eye" size={32} className="text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif mb-8">Контакты</h2>
          <div className="flex justify-center gap-8 text-lg flex-wrap">
            <a href="mailto:alisa@example.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Icon name="Mail" size={24} />
              <span>alisa@example.com</span>
            </a>
            <a href="tel:+79001234567" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Icon name="Phone" size={24} />
              <span>+7 900 123-45-67</span>
            </a>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {selectedProject?.description}
            </p>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif">Обложка проекта</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Icon name="Upload" size={16} className="mr-2" />
                  )}
                  Загрузить обложку
                </Button>
              </div>
              <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img 
                  src={selectedProject?.coverImage} 
                  alt={selectedProject?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif">Фотогалерея</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const image = selectedProject?.images.find(img => img.position === idx);
                  return (
                    <div 
                      key={idx}
                      className="relative aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      {image ? (
                        <>
                          <img 
                            src={image.url} 
                            alt={`${selectedProject?.title} ${idx + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover-scale"
                            onClick={() => setSelectedImage(image.url)}
                          />
                          <div className="absolute top-2 right-2">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              ref={(el) => {
                                if (el) galleryInputRefs.current[idx] = el;
                              }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && selectedProject) {
                                  handleGalleryUpload(selectedProject.id, file, idx);
                                }
                              }}
                            />
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="h-8 w-8"
                              disabled={uploading}
                              onClick={(e) => {
                                e.stopPropagation();
                                galleryInputRefs.current[idx]?.click();
                              }}
                            >
                              <Icon name="Upload" size={14} />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => {
                            if (!uploading) {
                              galleryInputRefs.current[idx]?.click();
                            }
                          }}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={(el) => {
                              if (el) galleryInputRefs.current[idx] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && selectedProject) {
                                handleGalleryUpload(selectedProject.id, file, idx);
                              }
                            }}
                          />
                          {uploading ? (
                            <Icon name="Loader2" size={32} className="text-muted-foreground animate-spin" />
                          ) : (
                            <div className="text-center">
                              <Icon name="Plus" size={32} className="text-muted-foreground mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">Добавить фото</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl p-0 bg-black/95">
          <div className="relative aspect-auto max-h-[90vh]">
            <img 
              src={selectedImage || ''} 
              alt="Full size"
              className="w-full h-full object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}