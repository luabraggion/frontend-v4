'use client';

import { Button } from '@/components/buttons';
import {
  AddProdutoIncentivador,
  CustomSelect,
  DatePicker,
  FileUpload,
  Input,
  ProdutoIncentivador,
} from '@/components/forms';
import { Breadcrumb } from '@/components/layout';
import { usePageTitle } from '@/components/PageTitleContext';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { PackagePlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DateState {
  date: Date | undefined;
  value: string;
}

export default function EditPage() {
  const { setTitle } = usePageTitle();

  // Estado para controle da data de início da campanha
  const [startDateState, setStartDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  // Estado para controle da data de fim da campanha
  const [endDateState, setEndDateState] = useState<DateState>({
    date: undefined,
    value: '',
  });

  // Configuração de anos para seleção de datas
  const currentYear = getCurrentYear();
  const yearRange = {
    fromYear: currentYear,
    toYear: currentYear + 2,
  };

  // Handler para atualização da data de início
  const handleStartDateChange = (date: Date | undefined, value: string) => {
    setStartDateState({ date, value });
  };

  // Handler para atualização da data de fim
  const handleEndDateChange = (date: Date | undefined, value: string) => {
    setEndDateState({ date, value });
  };

  // Estado para controle do valor selecionado no CustomSelect
  const [selectedValueCluster, setSelectedValueCluster] = useState('');

  const pageTitle = 'Editar Benefícios';

  useEffect(() => {
    setTitle(pageTitle);
  }, [setTitle, pageTitle]);

  return (
    <Card className="flex-1 flex flex-col bg-accent shadow-none border-none p-0">
      {/* Define o breadcrumb para esta página */}
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Benefícios', href: '/' },
          { label: pageTitle, isCurrent: true },
        ]}
      />
      <CardHeader className="px-0">
        <CardTitle>Editar Benefícios</CardTitle>
        <CardDescription>
          Aqui você pode editar os detalhes da campanha de benefícios, como título, datas, cluster e
          documentos relacionados.
        </CardDescription>
        <CardAction>
          <Button variant="ghost">Cancelar</Button>
          <Button className="ml-2">Salvar</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-6 space-y-6 px-0">
        <div className="grid gap-4 md:grid-cols-4 items-end">
          <Input
            id="sheet-demo-name"
            label="Alterar título do benefício"
            className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-sky-200 bg-white"
          />
          <CustomSelect
            label="Cluster"
            options={[
              { label: 'Opção 1', value: 'option1' },
              { label: 'Opção 2', value: 'option2' },
              { label: 'Opção 3', value: 'option3' },
            ]}
            value={selectedValueCluster}
            onChange={(value) => setSelectedValueCluster(value)}
            className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
            placeholder="Selecione o cluster..."
          />
          <DatePicker
            label="Início da Exibição"
            value={startDateState.value}
            date={startDateState.date}
            fromYear={yearRange.fromYear}
            toYear={yearRange.toYear}
            placeholder="Data de início"
            onDateChange={handleStartDateChange}
            className="bg-white outline-none focus:ring-0 h-10"
          />
          <DatePicker
            label="Fim da Exibição"
            value={endDateState.value}
            date={endDateState.date}
            fromYear={yearRange.fromYear}
            toYear={yearRange.toYear}
            placeholder="Data de encerramento"
            onDateChange={handleEndDateChange}
            className="bg-white outline-none focus:ring-0 h-10"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <FileUpload
            label="Enviar banner de chamada"
            onFileSelect={(file) => {
              const fileInfo = {
                name: file.name,
                size: file.size,
                type: file.type,
              };
              console.warn('Arquivo selecionado:', fileInfo);
            }}
            accept="image/jpeg,image/png,image/gif"
            maxSizeMB={10}
            className="mt-2"
            acceptText="PNG, JPG, GIF até 10MB"
          />
          <FileUpload
            label="Enviar folheto de regras"
            onFileSelect={(_file) => {}}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            maxSizeMB={10}
            className="mt-2"
            acceptText="PDF, DOC até 10MB"
          />
          <FileUpload
            label="Regulamento e Termos da Premiação"
            onFileSelect={(_file) => {}}
            accept="application/pdf"
            maxSizeMB={10}
            className="mt-2"
            acceptText="PDF até 10MB"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ProdutoIncentivador
            onDelete={() => {
              // Implementar lógica de exclusão
              console.warn('Produto incentivador excluído');
            }}
            opcoesDeSelecao={{
              fornecedor: [
                { label: 'Fornecedor 1', value: 'fornecedor1' },
                { label: 'Fornecedor 2', value: 'fornecedor2' },
              ],
              departamento: [],
              categoria: [],
              marca: [],
              produto: [],
            }}
          />
          <AddProdutoIncentivador
            onClick={() => {
              // Aqui você implementa a lógica para adicionar um novo produto incentivador
              console.warn('Adicionar novo produto incentivador');
            }}
            icon={PackagePlusIcon}
            color="green"
          />
        </div>
      </CardContent>
    </Card>
  );
}
