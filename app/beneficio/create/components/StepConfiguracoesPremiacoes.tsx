'use client';

import {
  AddProdutoIncentivador,
  Input,
  Label,
  ProdutoIncentivador,
  RadioGroupCustom,
} from '@/components/forms';
import FileUpload from '@/components/forms/FileUpload';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { applyCurrencyMask } from '@/utils/masks';
import { PackagePlusIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { z } from 'zod';

// Schema de validação Zod para configurações de premiação
const configuracoesPremiacoesSchema = z
  .object({
    filtrarPorValorGasto: z.boolean(),
    filtrarPorProduto: z.boolean(),
    valorMinimoGasto: z.string().optional(),
    tipoResgate: z.string().min(1, 'Selecione o tipo de resgate'),
    tipoAcumulacao: z.string().min(1, 'Selecione o tipo de acumulação'),
    tipoSorteio: z.string().min(1, 'Selecione o tipo de sorteio'),
    arquivoRegulamento: z
      .instanceof(File, { message: 'Faça upload do documento de regulamento' })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Se filtrar por valor gasto, valorMinimoGasto é obrigatório e deve ser válido
    if (data.filtrarPorValorGasto) {
      // Verifica se o campo está vazio
      if (!data.valorMinimoGasto || data.valorMinimoGasto.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe um valor mínimo válido maior que R$ 0,00',
          path: ['valorMinimoGasto'],
        });
        return;
      }

      // Valida se o valor é maior que zero
      const numbers = data.valorMinimoGasto.replace(/\D/g, '');
      const valorNumerico = parseInt(numbers || '0') / 100;
      if (valorNumerico <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe um valor mínimo válido maior que R$ 0,00',
          path: ['valorMinimoGasto'],
        });
      }
    }
  });

type ConfiguracoesPremiacoesFormData = z.infer<typeof configuracoesPremiacoesSchema>;

// Interface para expor métodos do componente
export interface StepConfiguracoesPremiacoesRef {
  validar: () => boolean;
}

/**
 * Componente para a etapa de configurações de premiação no fluxo de criação de benefícios
 */
const StepConfiguracoesPremiacoes = forwardRef<StepConfiguracoesPremiacoesRef>((props, ref) => {
  // Estado para controlar o switch de filtrar por valor gasto
  const [filtrarPorValorGasto, setFiltrarPorValorGasto] = useState(false);

  // Estado para controlar o switch de filtrar por produto incentivador
  const [filtrarPorProduto, setFiltrarPorProduto] = useState(false);

  // Estados para os campos obrigatórios
  const [valorMinimoGasto, setValorMinimoGasto] = useState('');
  const [tipoResgate, setTipoResgate] = useState('');
  const [tipoAcumulacao, setTipoAcumulacao] = useState('');
  const [tipoSorteio, setTipoSorteio] = useState('');
  const [arquivoRegulamento, setArquivoRegulamento] = useState<File | null>(null);

  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para validar o formulário
  const validarFormulario = (): boolean => {
    console.log('=== INICIANDO VALIDAÇÃO ===');
    console.log('filtrarPorValorGasto:', filtrarPorValorGasto);
    console.log('valorMinimoGasto:', valorMinimoGasto);
    console.log('tipoResgate:', tipoResgate);
    console.log('tipoAcumulacao:', tipoAcumulacao);
    console.log('tipoSorteio:', tipoSorteio);

    try {
      configuracoesPremiacoesSchema.parse({
        filtrarPorValorGasto,
        filtrarPorProduto,
        valorMinimoGasto,
        tipoResgate,
        tipoAcumulacao,
        tipoSorteio,
        arquivoRegulamento,
      });

      // Limpa erros se validação passar
      setErrors({});
      console.log('✅ VALIDAÇÃO PASSOU');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapeia os erros do Zod para um objeto de erros
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });

        console.log('❌ ERROS DE VALIDAÇÃO:');
        console.log('Erros encontrados:', formattedErrors);
        console.log('Total de erros:', Object.keys(formattedErrors).length);

        setErrors(formattedErrors);
      }
      return false;
    }
  };

  // Expõe o método de validação para o componente pai via ref
  useImperativeHandle(ref, () => ({
    validar: validarFormulario,
  }));

  return (
    <section>
      <CardHeader className="px-0">
        <CardTitle>Configuração de Premiação</CardTitle>
        <CardDescription>
          É a etapa onde você define como os clientes serão recompensados dentro da campanha. Aqui
          entram regras como valores, percentuais, limites e critérios que determinam a forma em que
          o benefício será entregue.
        </CardDescription>
      </CardHeader>
      <Separator className="my-8" />
      <section className="space-y-3">
        <div className="grid gap-4 border p-4 rounded-md">
          <Label>Regras de Qualificação para Participação</Label>
          <div className="grid gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="filtro-valor"
                className="data-[state=checked]:bg-green-500"
                checked={filtrarPorValorGasto}
                onCheckedChange={(checked) => {
                  setFiltrarPorValorGasto(checked);
                  // Limpa erro do valorMinimoGasto quando desliga o switch
                  if (!checked && errors.valorMinimoGasto) {
                    setErrors((prev) => ({ ...prev, valorMinimoGasto: '' }));
                  }
                }}
              />
              <Label htmlFor="filtro-valor" className="text-gray-500 font-normal">
                Filtrar por valor gasto
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="filtro-produto"
                className="data-[state=checked]:bg-green-500"
                checked={filtrarPorProduto}
                onCheckedChange={setFiltrarPorProduto}
              />
              <Label htmlFor="filtro-produto" className="text-gray-500 font-normal">
                Filtrar por produto incentivador
              </Label>
            </div>
          </div>
        </div>
        {filtrarPorProduto && (
          <div className="grid gap-4 border p-4 rounded-md">
            <CardHeader className="px-0">
              <CardTitle className="text-sm font-medium">Configurar Produto Incentivador</CardTitle>
              <CardDescription>
                Produto incentivador é o item escolhido pela marca que da vantagens extras ao
                cliente na campanha, como mais chances de ganhar, pontos adicionais ou giros extras.
              </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        )}
        {filtrarPorValorGasto && (
          <div className="grid gap-4 border p-4 rounded-md">
            <Label>Qual o minímo de valor gasto?</Label>
            <Input
              placeholder="R$ 0,00"
              hideLabel
              value={valorMinimoGasto}
              onChange={(e) => {
                const maskedValue = applyCurrencyMask(e.target.value);
                setValorMinimoGasto(maskedValue);
                // Limpa erro ao digitar
                if (errors.valorMinimoGasto) {
                  setErrors((prev) => ({ ...prev, valorMinimoGasto: '' }));
                }
              }}
              className={`focus-visible:outline-none focus-visible:ring-0 ${
                errors.valorMinimoGasto
                  ? 'border-red-500 focus-visible:border-red-500'
                  : 'focus-visible:border-blue-200'
              }`}
            />
            {errors.valorMinimoGasto && (
              <p className="text-sm text-red-500 mt-1">{errors.valorMinimoGasto}</p>
            )}
          </div>
        )}
        <div className="grid gap-3">
          <RadioGroupCustom
            label="Selecione o tipo de resgate do produto"
            items={[
              { value: 'resgate-automatico', label: 'Resgate Automático' },
              { value: 'resgate-manual', label: 'Resgate Manual' },
            ]}
            className={`border p-4 rounded-md ${errors.tipoResgate ? 'border-red-500' : ''}`}
            labelClassName="font-normal text-gray-500"
            onChange={(value) => {
              setTipoResgate(value);
              // Limpa erro ao selecionar
              if (errors.tipoResgate) {
                setErrors((prev) => ({ ...prev, tipoResgate: '' }));
              }
            }}
          />
          {errors.tipoResgate && <p className="text-sm text-red-500 -mt-2">{errors.tipoResgate}</p>}
        </div>
        <div className="grid gap-3">
          <RadioGroupCustom
            label="Defina se os valores das compras serão acumulados ao longo da campanha ou avaliados individualmente por compra."
            items={[
              { value: 'acumulativo', label: 'Acumulativo' },
              { value: 'nao-acumulativo', label: 'Não Acumulativo' },
            ]}
            className={`border p-4 rounded-md ${errors.tipoAcumulacao ? 'border-red-500' : ''}`}
            labelClassName="font-normal text-gray-500"
            onChange={(value) => {
              setTipoAcumulacao(value);
              // Limpa erro ao selecionar
              if (errors.tipoAcumulacao) {
                setErrors((prev) => ({ ...prev, tipoAcumulacao: '' }));
              }
            }}
          />
          {errors.tipoAcumulacao && (
            <p className="text-sm text-red-500 -mt-2">{errors.tipoAcumulacao}</p>
          )}
        </div>
        <div className="grid gap-3">
          <RadioGroupCustom
            label="Selecione se o sorteio é oficial ou não oficial"
            items={[
              { value: 'oficial', label: 'Oficial via SECAP ' },
              { value: 'nao-oficial', label: 'Não Oficial' },
            ]}
            className={`border p-4 rounded-md ${errors.tipoSorteio ? 'border-red-500' : ''}`}
            labelClassName="font-normal text-gray-500"
            onChange={(value) => {
              setTipoSorteio(value);
              // Limpa erro ao selecionar
              if (errors.tipoSorteio) {
                setErrors((prev) => ({ ...prev, tipoSorteio: '' }));
              }
            }}
          />
          {errors.tipoSorteio && <p className="text-sm text-red-500 -mt-2">{errors.tipoSorteio}</p>}
        </div>
        <div className="grid gap-3">
          <FileUpload
            label="Documento Regulamento e Termos da Premiação"
            onFileSelect={(file) => {
              setArquivoRegulamento(file);
              // Limpa erro ao fazer upload
              if (errors.arquivoRegulamento) {
                setErrors((prev) => ({ ...prev, arquivoRegulamento: '' }));
              }
            }}
            accept="application/pdf"
            maxSizeMB={10}
            className={`mt-2 ${errors.arquivoRegulamento ? 'border-red-500' : ''}`}
            acceptText="PDF até 10MB"
          />
          {errors.arquivoRegulamento && (
            <p className="text-sm text-red-500">{errors.arquivoRegulamento}</p>
          )}
        </div>
      </section>
    </section>
  );
});

StepConfiguracoesPremiacoes.displayName = 'StepConfiguracoesPremiacoes';

export default StepConfiguracoesPremiacoes;
