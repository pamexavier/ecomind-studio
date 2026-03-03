import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, ArrowRight, Home, Building2, Utensils, Bed, 
  Monitor, Bath, Sun, Thermometer, Palette, Leaf, 
  Flame, Loader2, Ruler, Home as HouseIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { RoomType, ObjectiveType, EnvironmentFormData } from '@/types/analysis';

// Schema de validação técnica
const formSchema = z.object({
  roomType: z.string().min(1, 'Selecione o tipo de ambiente'),
  location: z.string().min(3, 'Informe a localização'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  objectives: z.array(z.string()).min(1, 'Selecione pelo menos um objetivo'),
  description: z.string().min(10, 'Descreva o ambiente com mais detalhes'),
  area: z.string().min(1, 'Informe a área (m²)'),
  height: z.string().min(1, 'Informe o pé-direito (m)'),
  sunPosition: z.string().default('tarde'),
  ceilingType: z.string().default('laje'),
});

type FormValues = z.infer<typeof formSchema>;

const roomTypes: { value: RoomType; label: string; icon: any }[] = [
  { value: 'sala', label: 'Sala', icon: Home },
  { value: 'quarto', label: 'Quarto', icon: Bed },
  { value: 'escritorio', label: 'Escritório', icon: Monitor },
  { value: 'cozinha', label: 'Cozinha', icon: Utensils },
  { value: 'banheiro', label: 'Banheiro', icon: Bath },
  { value: 'varanda', label: 'Varanda', icon: Building2 },
];

const objectivesList = [
  { value: 'iluminacao_natural', label: 'Mais iluminação natural', icon: Sun },
  { value: 'menos_calor', label: 'Menos calor', icon: Flame },
  { value: 'conforto_termico', label: 'Mais conforto térmico', icon: Thermometer },
  { value: 'estetica', label: 'Melhor estética', icon: Palette },
  { value: 'sustentabilidade', label: 'Sustentabilidade', icon: Leaf },
];

export default function EnvironmentForm() {
  const { formData, updateFormData, setCurrentStep } = useAnalysis();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
      objectives: formData.objectives || [],
    }
  });

  const selectedObjectives = watch('objectives') || [];

  const handleSearchAddress = (query: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Erro na busca de endereço");
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const toggleObjective = (value: string) => {
    const current = selectedObjectives;
    const updated = current.includes(value)
      ? current.filter((o) => o !== value)
      : [...current, value];
    setValue('objectives', updated);
  };

  const onSubmit = (data: FormValues) => {
    updateFormData(data as Partial<EnvironmentFormData>);
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">Dados do Ambiente</h2>
        <p className="text-muted-foreground">Insira as medidas e localização para uma análise bioclimática precisa.</p>
      </div>

      {/* Tipo de Ambiente */}
      <div className="space-y-4">
        <Label className="text-foreground font-medium text-lg">Qual o ambiente?</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {roomTypes.map((room) => (
            <button
              key={room.value}
              type="button"
              onClick={() => setValue('roomType', room.value)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:border-primary/50 bg-card ${watch('roomType') === room.value ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <room.icon className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">{room.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Localização e Medidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 relative" ref={suggestionsRef}>
          <Label htmlFor="location">Localização (Cidade/UF) *</Label>
          <div className="relative">
            <Input
              id="location"
              placeholder="Ex: Araguaína, TO"
              {...register('location')}
              onChange={(e) => {
                register('location').onChange(e);
                handleSearchAddress(e.target.value);
              }}
              autoComplete="off"
              className="bg-background"
            />
            {isSearching && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
          {showSuggestions && (
            <div className="absolute z-50 w-full bg-card border rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
              {suggestions.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-accent text-sm border-b last:border-0"
                  onClick={() => {
                    setValue('location', item.display_name);
                    setValue('latitude', parseFloat(item.lat));
                    setValue('longitude', parseFloat(item.lon));
                    setShowSuggestions(false);
                  }}
                >
                  {item.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Ruler className="w-3 h-3"/> Área (m²)
            </Label>
            <Input type="number" step="0.1" {...register('area')} placeholder="Ex: 20" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Ruler className="w-3 h-3"/> Pé-direito (m)
            </Label>
            <Input type="number" step="0.1" {...register('height')} placeholder="Ex: 2.7" className="bg-background" />
          </div>
        </div>
      </div>

      {/* Sol e Cobertura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Sun className="w-4 h-4 text-orange-500"/> Sol Crítico</Label>
          <Select value={watch('sunPosition')} onValueChange={(v) => setValue('sunPosition', v)}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manha">Manhã (Leste)</SelectItem>
              <SelectItem value="tarde">Tarde (Oeste - Mais quente)</SelectItem>
              <SelectItem value="dia_todo">Dia todo (Norte)</SelectItem>
              <SelectItem value="pouca">Pouca incidência (Sul)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><HouseIcon className="w-4 h-4 text-blue-500"/> Cobertura</Label>
          <Select value={watch('ceilingType')} onValueChange={(v) => setValue('ceilingType', v)}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="laje">Laje de Concreto</SelectItem>
              <SelectItem value="telhado_ceramico">Telhado Cerâmico</SelectItem>
              <SelectItem value="fibrocimento">Fibrocimento (Eternit)</SelectItem>
              <SelectItem value="metalico">Telhado Metálico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Objetivos */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Objetivos principais *</Label>
        <div className="flex flex-wrap gap-2">
          {objectivesList.map((obj) => (
            <button
              key={obj.value}
              type="button"
              onClick={() => toggleObjective(obj.value)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                selectedObjectives.includes(obj.value) 
                ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                : 'bg-background hover:border-primary/50 text-muted-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <obj.icon className="w-3 h-3" /> {obj.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição das necessidades</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          placeholder="Ex: Ambiente abafado, pouca circulação de ar..."
          className="min-h-[100px] bg-background" 
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={() => setCurrentStep(0)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button type="submit" className="gap-2 px-8">
          Iniciar Análise Profissional <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}