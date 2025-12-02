import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
}

const projects: Project[] = [
  { id: '1', title: 'Розовое платье', description: 'Театральная постановка о женской судьбе и выборе. Минималистичные декорации подчеркивают внутренний мир героини.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '2', title: 'Лубянский Гримёр', description: 'Драматический спектакль о художнике в эпоху перемен. Контрастные цветовые решения передают атмосферу времени.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '3', title: 'Лавр', description: 'Постановка по роману Евгения Водолазкина. Аскетичные декорации создают средневековую атмосферу.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '4', title: 'Я убил царя', description: 'Историческая драма о выборе и ответственности. Символизм в каждой детали оформления.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '5', title: 'Эзоп', description: 'Философская притча о силе слова. Минималистичное пространство усиливает акцент на тексте.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '6', title: 'Преступление и Наказание', description: 'Классика Достоевского на современной сцене. Тёмные тона передают атмосферу романа.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '7', title: 'Оборванец', description: 'История о человеке на краю общества. Сценография отражает внутренний разлом героя.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '8', title: 'Король умирает', description: 'Пьеса Эжена Ионеско о финале жизни. Абсурдистская эстетика в каждой детали.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '9', title: 'У премьер министра мало друзей', description: 'Политическая драма с острым социальным подтекстом. Строгие линии подчеркивают тему власти.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '10', title: 'Ватутина', description: 'Спектакль о женщине-герое. Монументальность образов в декорациях.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '11', title: 'Долгарева', description: 'Современная драма о поиске себя. Лаконичные декорации оставляют пространство для эмоций.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '12', title: 'МХАТ - Сочи', description: 'Постановка для филиала МХАТа в Сочи. Легкость и воздушность южного города в оформлении.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '13', title: 'МХАТ - 36 часов', description: 'Интенсивная драма о критическом моменте. Динамичные декорации следуют за развитием действия.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
  { id: '14', title: 'Выбор героя', description: 'Философская постановка о моральном выборе. Каждая деталь оформления несёт смысловую нагрузку.', coverImage: '/placeholder.svg', images: Array(5).fill('/placeholder.svg') },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
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
                <h3 className="text-xl font-serif">Фотогалерея</h3>
                <Button variant="outline" size="sm">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Загрузить фото
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProject?.images.map((image, idx) => (
                  <div 
                    key={idx}
                    className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover-scale"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${selectedProject.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Icon name="Upload" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
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