import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Home, Building2, Utensils, Bed, Monitor, Bath, Sun, Thermometer, Palette, Leaf, Flame, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { RoomType, ObjectiveType, EnvironmentFormData } from '@/types/analysis';

const formSchema = z.object({
  roomType: z.string().min(1, 'Selecione o tipo de ambiente'),
  location: z.string().min(3, 'Informe a localização'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  objectives: z.array(z.string()).min(1, 'Selecione pelo menos um objetivo'),
  description: z.string().min(10, 'Descreva o ambiente com mais detalhes'),
  width: z.string().optional(),
  length: z.string().optional(),
  height: z.string().optional(),
  windowPosition: z.string().optional(),
  budget: z.string().optional(),
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

const objectives: { value: ObjectiveType; label: string; icon: any }[] = [
  { value: 'iluminacao_natural', label: 'Mais iluminação natural', icon: Sun },
  { value: 'menos_calor', label: 'Menos calor', icon: Flame },
  { value: 'conforto_termico', label: 'Mais conforto térmico', icon: Thermometer },
  { value: 'estetica', label: 'Melhor estética', icon: Palette },
  { value: 'sustentabilidade', label: 'Sustentabilidade', icon: Leaf },
];

export default function EnvironmentForm() {
  const { setFormData, setCurrentStep } = useAnalysis();
  const [selectedObjectives, setSelectedObjectives] = useState<ObjectiveType[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { objectives: [] }
  });

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleObjective = (value: ObjectiveType) => {
    const newObjectives = selectedObjectives.includes(value)
      ? selectedObjectives.filter((o) => o !== value)
      : [...selectedObjectives, value];
    setSelectedObjectives(newObjectives);
    setValue('objectives', newObjectives);
  };

  const onSubmit = (data: FormValues) => {
    setFormData(data as EnvironmentFormData);
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tipo de Ambiente */}
      <div className="space-y-4">
        <Label className="text-foreground font-medium text-lg">Qual o ambiente?</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {roomTypes.map((room) => (
            <button
              key={room.value}
              type="button"
              onClick={() => setValue('roomType', room.value)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:border-primary/50 focus:border-primary bg-card"
            >
              <room.icon className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">{room.label}</span>
            </button>
          ))}
        </div>
        {errors.roomType && <p className="text-sm text-destructive">{errors.roomType.message}</p>}
      </div>

      {/* Localização com Busca Inteligente */}
      <div className="space-y-2 relative" ref={suggestionsRef}>
        <Label htmlFor="location" className="text-foreground font-medium">
          Endereço Completo ou Localização *
        </Label>
        <div className="relative">
          <Input
            id="location"
            placeholder="Digite seu endereço (Rua, Número, Cidade)..."
            {...register('location')}
            autoComplete="off"
            onChange={(e) => {
              register('location').onChange(e);
              handleSearchAddress(e.target.value);
            }}
            className="bg-background pr-10"
          />
          {isSearching && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[100] w-full bg-card border border-border rounded-xl mt-1 shadow-2xl max-h-[200px] overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-primary/10 text-sm border-b last:border-0 border-border transition-colors"
                onClick={() => {
                  setValue('location', item.display_name);
                  setValue('latitude', parseFloat(item.lat));
                  setValue('longitude', parseFloat(item.lon));
                  setShowSuggestions(false);
                }}
              >
                <span className="font-medium block truncate">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
        {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
      </div>

      {/* Objetivos */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Objetivos principais *</Label>
        <div className="flex flex-wrap gap-3">
          {objectives.map((obj) => (
            <button
              key={obj.value}
              type="button"
              onClick={() => toggleObjective(obj.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                selectedObjectives.includes(obj.value) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'
              }`}
            >
              <obj.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{obj.label}</span>
            </button>
          ))}
        </div>
        {errors.objectives && <p className="text-sm text-destructive">{errors.objectives.message}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição das necessidades *</Label>
        <Textarea
          id="description"
          placeholder="Ex: Sala com sol da tarde muito forte. Gostaria de opções de vidros ou películas..."
          {...register('description')}
          className="min-h-[120px]"
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      {/* Navegação */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(0)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button type="submit" className="gap-2">
          Iniciar Análise <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}