'use client';

import { Button, ButtonIcon } from '@/components/buttons';
import { DatePicker, Input, Label } from '@/components/forms';
import CustomSelect from '@/components/forms/CustomSelect';
import { usePageTitle } from '@/components/PageTitleContext';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentYear } from '@/lib/ui/date-utils';
import { ImageUp, PackagePlusIcon, Trash } from 'lucide-react';
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

  useEffect(() => {
    setTitle('Benefícios');
  }, [setTitle]);

  // Componente auxiliar para o conteúdo dos tabs
  function CompraTabContent({ placeholder, suffix }: { placeholder: string; suffix: string }) {
    return (
      <div className="inline space-x-2 text-sm text-gray-500">
        <span>Comprando</span>
        <Input
          hideLabel
          className="w-16"
          containerClassName="w-max inline-flex"
          placeholder={placeholder}
          size="sm"
        />
        <span>{suffix} em produtos selecionados no filtro.</span>
      </div>
    );
  }

  // Componente auxiliar para o benefício dos tabs
  function BeneficioTabContent({ placeholder, suffix }: { placeholder: string; suffix: string }) {
    const prefix = (() => {
      if (suffix === 'reais') return 'Acelerador multiplica em';
      if (suffix === 'unidades') return 'O cliente receberá';
      return '';
    })();
    const suffixText =
      suffix === 'reais'
        ? 'do produto selecionado, aumentando o benefício do cliente.'
        : suffix === 'unidades'
          ? 'chances adicionais como benefício.'
          : '';
    return (
      <div className="inline space-x-2 text-sm text-gray-500">
        <span>{prefix}</span>
        <Input
          hideLabel
          className="w-16"
          containerClassName="w-max inline-flex"
          placeholder={placeholder}
          size="sm"
        />
        <span>{suffixText}</span>
      </div>
    );
  }

  return (
    <Card className="flex-1 flex flex-col bg-accent shadow-none border-none p-0">
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
          <div>
            <Label
              htmlFor="cover-photo"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Enviar banner de chamada
            </Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25 bg-white">
              <div className="text-center">
                <ImageUp
                  aria-hidden="true"
                  className="mx-auto size-12 text-gray-300 dark:text-gray-500"
                />
                <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300"
                  >
                    <span>Carregar arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs/5 text-gray-600 dark:text-gray-400">
                  PNG, JPG, GIF up max 10MB
                </p>
              </div>
            </div>
          </div>
          <div>
            <Label
              htmlFor="cover-photo"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Enviar folheto de regras
            </Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25 bg-white">
              <div className="text-center">
                <ImageUp
                  aria-hidden="true"
                  className="mx-auto size-12 text-gray-300 dark:text-gray-500"
                />
                <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300"
                  >
                    <span>Carregar arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs/5 text-gray-600 dark:text-gray-400">PDF, DOC up max 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <Label
              htmlFor="cover-photo"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Regulamento e Termos da Premiação
            </Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25 bg-white">
              <div className="text-center">
                <ImageUp
                  aria-hidden="true"
                  className="mx-auto size-12 text-gray-300 dark:text-gray-500"
                />
                <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300"
                  >
                    <span>Carregar arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs/5 text-gray-600 dark:text-gray-400">PDF up máx 10MB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg shadow-xs p-6 dark:border-white/25 space-y-2 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium">Produto Incentivador</span>
              <ButtonIcon icon={<Trash />} variant="destructive" />
            </div>
            <CustomSelect
              options={[]}
              value={selectedValueCluster}
              onChange={(value) => setSelectedValueCluster(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione o fornecedor..."
            />
            <CustomSelect
              options={[]}
              value={selectedValueCluster}
              onChange={(value) => setSelectedValueCluster(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione o departamento..."
            />
            <CustomSelect
              options={[]}
              value={selectedValueCluster}
              onChange={(value) => setSelectedValueCluster(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione a categoria..."
            />
            <CustomSelect
              options={[]}
              value={selectedValueCluster}
              onChange={(value) => setSelectedValueCluster(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione a marca..."
            />
            <CustomSelect
              options={[]}
              value={selectedValueCluster}
              onChange={(value) => setSelectedValueCluster(value)}
              className="bg-white focus-visible:outline-none focus-visible:border focus-visible:border-gray-200 focus-visible:ring-0"
              placeholder="Selecione o produto..."
            />
            <Separator className="my-6" />
            <Tabs defaultValue="valor" className="my-6">
              <TabsList className="border w-full">
                <TabsTrigger value="valor">Valor</TabsTrigger>
                <TabsTrigger value="quantidade">Quantidade</TabsTrigger>
              </TabsList>
              <TabsContent value="valor" className="py-2">
                <CompraTabContent placeholder="4,00" suffix="reais" />
              </TabsContent>
              <TabsContent value="quantidade" className="py-2">
                <CompraTabContent placeholder="4,00" suffix="unidades" />
              </TabsContent>
            </Tabs>
            <Separator className="my-6" />
            <Tabs defaultValue="acelerador" className="my-6">
              <TabsList className="border w-full">
                <TabsTrigger value="acelerador">Acelerador</TabsTrigger>
                <TabsTrigger value="chances">Chances</TabsTrigger>
              </TabsList>
              <TabsContent value="acelerador" className="py-2">
                <BeneficioTabContent placeholder="5" suffix="reais" />
              </TabsContent>
              <TabsContent value="chances" className="py-2">
                <BeneficioTabContent placeholder="5" suffix="unidades" />
              </TabsContent>
            </Tabs>
            <Separator className="my-6" />
            <div className="space-y-4">
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
          </div>
          <div className="border border-dashed rounded-lg shadow-xs p-6 dark:border-white/25 space-y-2 border-green-700 hover:bg-green-50 hover:cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full gap-y-2 text-green-700">
              <span className="text-sm text-gray-500">
                <PackagePlusIcon size={36} className="text-green-700" />
              </span>
              <span className="text-lg font-semibold">Adicionar Produto Incentivador</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
