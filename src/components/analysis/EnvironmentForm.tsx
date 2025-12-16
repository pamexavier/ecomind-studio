import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Home, Building2, Utensils, Bed, Monitor, Bath, Sun, Thermometer, Palette, Leaf, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { RoomType, ObjectiveType, BudgetLevel, WindowPosition, EnvironmentFormData } from '@/types/analysis';

const formSchema = z.object({
  roomType: z.string().min(1, 'Selecione o tipo de ambiente'),
  location: z.string().min(3, 'Informe a localização'),
  objectives: z.array(z.string()).min(1, 'Selecione pelo menos um objetivo'),
  description: z.string().min(10, 'Descreva o ambiente com mais detalhes'),
  width: z.string().optional(),
  length: z.string().optional(),
  height: z.string().optional(),
  windowPosition: z.string().optional(),
  budget: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const roomTypes: { value: RoomType; label: string; icon: typeof Home }[] = [
  { value: 'sala', label: 'Sala', icon: Home },
  { value: 'quarto', label: 'Quarto', icon: Bed },
  { value: 'escritorio', label: 'Escritório', icon: Monitor },
  { value: 'cozinha', label: 'Cozinha', icon: Utensils },
  { value: 'banheiro', label: 'Banheiro', icon: Bath },
  { value: 'varanda', label: 'Varanda', icon: Building2 },
];

const objectives: { value: ObjectiveType; label: string; icon: typeof Sun }[] = [
  { value: 'iluminacao_natural', label: 'Mais iluminação natural', icon: Sun },
  { value: 'menos_calor', label: 'Menos calor', icon: Flame },
  { value: 'conforto_termico', label: 'Mais conforto térmico', icon: Thermometer },
  { value: 'estetica', label: 'Melhor estética', icon: Palette },
  { value: 'sustentabilidade', label: 'Sustentabilidade', icon: Leaf },
];

export default function EnvironmentForm() {
  const { setFormData, setCurrentStep } = useAnalysis();
  const [selectedObjectives, setSelectedObjectives] = useState<ObjectiveType[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectives: [],
    },
  });

  const toggleObjective = (objective: ObjectiveType) => {
    const newObjectives = selectedObjectives.includes(objective)
      ? selectedObjectives.filter(o => o !== objective)
      : [...selectedObjectives, objective];
    
    setSelectedObjectives(newObjectives);
    setValue('objectives', newObjectives);
  };

  const onSubmit = (data: FormValues) => {
    const formData: EnvironmentFormData = {
      roomType: data.roomType as RoomType,
      location: data.location,
      objectives: data.objectives as ObjectiveType[],
      description: data.description,
      dimensions: (data.width || data.length || data.height) ? {
        width: data.width ? parseFloat(data.width) : undefined,
        length: data.length ? parseFloat(data.length) : undefined,
        height: data.height ? parseFloat(data.height) : undefined,
      } : undefined,
      windowPosition: data.windowPosition as WindowPosition | undefined,
      budget: data.budget as BudgetLevel | undefined,
    };
    
    setFormData(formData);
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Dados do Ambiente
        </h2>
        <p className="text-muted-foreground">
          Preencha as informações para uma análise mais precisa
        </p>
      </div>

      {/* Tipo de Ambiente */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Tipo de ambiente *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {roomTypes.map((room) => (
            <label
              key={room.value}
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${watch('roomType') === room.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <input
                type="radio"
                value={room.value}
                {...register('roomType')}
                className="sr-only"
              />
              <room.icon className={`w-5 h-5 ${watch('roomType') === room.value ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-medium text-foreground">{room.label}</span>
            </label>
          ))}
        </div>
        {errors.roomType && (
          <p className="text-sm text-destructive">{errors.roomType.message}</p>
        )}
      </div>

      {/* Localização */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground font-medium">
          Localização (Cidade, Estado) *
        </Label>
        <Input
          id="location"
          placeholder="Ex: São Paulo, SP"
          {...register('location')}
          className="bg-background"
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Objetivos */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Objetivos principais *</Label>
        <p className="text-sm text-muted-foreground">Selecione um ou mais objetivos</p>
        <div className="flex flex-wrap gap-3">
          {objectives.map((obj) => (
            <button
              key={obj.value}
              type="button"
              onClick={() => toggleObjective(obj.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                ${selectedObjectives.includes(obj.value)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary/50'
                }
              `}
            >
              <obj.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{obj.label}</span>
            </button>
          ))}
        </div>
        {errors.objectives && (
          <p className="text-sm text-destructive">{errors.objectives.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground font-medium">
          Descreva seu ambiente e necessidades *
        </Label>
        <Textarea
          id="description"
          placeholder="Ex: Sala de estar com janela grande voltada para oeste. No verão fica muito quente à tarde. Gostaria de mais conforto sem bloquear a vista."
          {...register('description')}
          className="bg-background min-h-[120px]"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Campos Opcionais */}
      <div className="space-y-4 p-6 rounded-xl bg-secondary/30 border border-border/50">
        <h3 className="font-medium text-foreground">Informações opcionais</h3>
        <p className="text-sm text-muted-foreground">
          Preencha para estimativas mais precisas de materiais
        </p>

        {/* Medidas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width" className="text-sm">Largura (m)</Label>
            <Input
              id="width"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('width')}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="length" className="text-sm">Comprimento (m)</Label>
            <Input
              id="length"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('length')}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm">Altura (m)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('height')}
              className="bg-background"
            />
          </div>
        </div>

        {/* Posição das Janelas */}
        <div className="space-y-2">
          <Label className="text-sm">Posição das janelas</Label>
          <Select onValueChange={(value) => setValue('windowPosition', value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frente">Frente (recebe sol da manhã)</SelectItem>
              <SelectItem value="lateral">Lateral</SelectItem>
              <SelectItem value="fundos">Fundos (recebe sol da tarde)</SelectItem>
              <SelectItem value="nenhuma">Sem janelas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orçamento */}
        <div className="space-y-2">
          <Label className="text-sm">Orçamento estimado</Label>
          <Select onValueChange={(value) => setValue('budget', value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixo">Baixo (soluções econômicas)</SelectItem>
              <SelectItem value="medio">Médio (equilíbrio custo-benefício)</SelectItem>
              <SelectItem value="alto">Alto (melhores soluções)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep(0)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button type="submit" className="gap-2">
          Iniciar Análise
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
