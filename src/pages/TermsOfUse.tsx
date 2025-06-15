
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Voltar">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
                alt="Bitget12" 
                className="h-8 w-8"
              />
              <span className="font-bold text-2xl text-primary">Bitget12</span>
            </div>
          </div>
          <Button onClick={() => navigate('/auth?mode=login')} variant="default">
            Entrar
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white/95 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">Políticas de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Objetivo</h2>
              <p>Esta Política de Uso estabelece as regras e condições para a participação de investidores na plataforma de investimento em criptomoedas BITGET12, onde especialistas gerenciam os fundos investidos e os lucros são distribuídos mensalmente aos investidores durante um período de 365 dias.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. Definições</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Plataforma:</strong> Sistema online que conecta investidores a especialistas em criptomoedas para gestão de investimentos.</li>
                <li><strong>Período de Investimento:</strong> 365 dias a partir da data de ativação do investimento.</li>
                <li><strong>Lucro Mensal:</strong> Retorno financeiro gerado pelos investimentos, distribuído aos investidores a cada 30 dias ou antes desde que atinja o limite estabelecida pela Bitget12.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. Condições de Participação</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">3.1. Elegibilidade:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Investidores devem ser maiores de 18 anos ou legalmente emancipados.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">3.2. Aporte Mínimo:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>O valor mínimo para investimento será informado no momento do cadastro e pode variar conforme a estratégia escolhida.</li>
                  <li>Os aportes devem ser realizados em moeda fiduciária ou criptomoedas aceitas pela plataforma.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">3.3. Gestão dos Fundos:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Os fundos investidos serão gerenciados exclusivamente por especialistas credenciados pela Bitget12.</li>
                  <li>A estratégia de investimento será definida pelos especialistas, com foco em criptomoedas, e os investidores não terão controle direto sobre as decisões de trading.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Distribuição de Lucros</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">4.1. Periodicidade:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Os lucros, serão calculados e distribuídos mensalmente, a cada 30 dias ou menos, durante o período de 365 dias.</li>
                  <li>O primeiro pagamento será realizado até 30 dias ou menos após a ativação do investimento.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">4.2. Cálculo dos Lucros:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>O lucro será proporcional ao valor investido pelo usuário, deduzidas as taxas administrativas e de performance.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">4.3. Forma de Pagamento:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Os lucros serão pagos na moeda ou criptomoeda definida no momento do cadastro, conforme escolha do investidor.</li>
                  <li>Pagamentos serão realizados via transferência para a carteira ou conta bancária registrada pelo usuário.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">5. Taxas</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">5.1. Taxa Administrativa:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Cobrada uma taxa equivalente a 25% do valor investido, para custeio da operação da plataforma.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">7. Prazo do Investimento</h2>
                <p className="mb-2"><strong>7.1.</strong> O investimento terá duração de 365 dias, contados a partir da ativação do aporte.</p>
                <p><strong>7.3.</strong> Ao final dos 365 dias, o investidor poderá optar por resgatar o capital remanescente, reinvestir ou encerrar sua participação.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">8. Responsabilidades</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">8.1. Da Plataforma:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Garantir a transparência na gestão e distribuição dos lucros.</li>
                  <li>Selecionar especialistas qualificados e monitorar suas atividades.</li>
                  <li>Proteger os dados dos investidores conforme a Lei de Regulamento Geral de Proteção de Dados Internacional (RGPDI)</li>
              </ul>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">8.2. Do Investidor:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer informações verdadeiras e atualizadas no cadastro.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">9. Rescisão</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">9.1. A plataforma poderá encerrar a participação de um investidor em caso de:</h3>
              <ul className="list-disc pl-6 space-y-2">
                  <li>Descumprimento desta Política ou dos Termos de Uso.</li>
                  <li>Suspeita de actividades ilegais ou fraudulentas.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">10. Disposições Gerais</h2>
              <p className="mb-2"><strong>10.1.</strong> Esta Política pode ser atualizada periodicamente, com notificação prévia aos investidores.</p>
              <p className="mb-2"><strong>10.2.</strong> Dúvidas ou reclamações devem ser encaminhadas ao suporte da plataforma via Telegram.</p>
              <p><strong>10.3.</strong> Esta Política é regida pelas leis Internacional.</p>
            </div>
            
            <p className="mt-8 text-right font-semibold text-gray-800">Data de Vigência: 30/06/2025</p>
          </CardContent>
        </Card>
      </main>
      <Footer variant="light" />
    </div>
  );
};

export default TermsOfUse;
