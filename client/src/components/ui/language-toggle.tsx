import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="bg-white/20 rounded-lg p-1 flex">
      <Button
        variant={language === 'mr' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('mr')}
        className={`px-3 py-1 text-xs font-medium ${
          language === 'mr'
            ? 'bg-white text-amber-700 hover:bg-white/90'
            : 'text-white hover:bg-white/10'
        }`}
      >
        मर
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-medium ${
          language === 'en'
            ? 'bg-white text-amber-700 hover:bg-white/90'
            : 'text-white hover:bg-white/10'
        }`}
      >
        EN
      </Button>
    </div>
  );
}
