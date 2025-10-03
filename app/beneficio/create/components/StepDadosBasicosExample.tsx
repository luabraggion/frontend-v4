'use client';

import { Input, Label } from '@/components/forms';
import { Button } from '@/components/index';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateWizard } from './CreateWizardContext';

/**
 * Exemplo de Step 1: Dados Básicos
 * Mostra como salvar dados no contexto
 */
export default function StepDadosBasicosExample() {
  const { wizardData, updateStep1 } = useCreateWizard();
  const dados = wizardData.step1;

  const handleSave = () => {
    console.log('Dados salvos:', wizardData.step1);
    // Aqui você pode adicionar validação antes de avançar
  };

  return (
    <section className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Dados Básicos</CardTitle>
        <CardDescription>Preencha as informações básicas do benefício.</CardDescription>
      </CardHeader>

      <div className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="nome">Nome do Benefício</Label>
          <Input
            id="nome"
            placeholder="Ex: Roleta da Sorte 2025"
            value={dados.nome || ''}
            onChange={(e) => updateStep1({ nome: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="descricao">Descrição</Label>
          <textarea
            id="descricao"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Descreva o benefício..."
            value={dados.descricao || ''}
            onChange={(e) => updateStep1({ descricao: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dados.dataInicio || ''}
              onChange={(e) => updateStep1({ dataInicio: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={dados.dataFim || ''}
              onChange={(e) => updateStep1({ dataFim: e.target.value })}
            />
          </div>
        </div>

        {/* Botão opcional para salvar/validar antes de avançar */}
        <div className="pt-4">
          <Button onClick={handleSave} variant="info">
            Validar Dados
          </Button>
        </div>
      </div>
    </section>
  );
}
