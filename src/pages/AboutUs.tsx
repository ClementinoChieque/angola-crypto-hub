import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AboutUs = () => {
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
          <CardHeader className="p-0">
            {/* Imagem de capa */}
            <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-lg">
              <img 
                src="/lovable-uploads/4d42eb4c-4fe2-451d-af1e-df22ec3ca43f.png" 
                alt="Bitget - The Perfect 10/10 Crypto Partner" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <CardTitle className="text-3xl font-bold text-center text-primary">Sobre Nós</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Quem Somos</h2>
              <p>Somos a <strong>Bitget12</strong>, uma plataforma inovadora de investimento em criptomoedas Fundada em 2019 que conecta investidores ao  mercado de ativos digitais. Fundada com a missão de democratizar o acesso a oportunidades de investimento em criptomoedas, oferecemos uma solução segura, transparente e acessível para quem deseja diversificar seu portfólio financeiro com o potencial de retorno do mercado cripto.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Nossa Missão</h2>
              <p>Proporcionar aos investidores, ¨
Como Encontrar e Comprar Novas Criptomoedas Antes da Listagem? | CoinEx Academy
coinex.com
 • 
SM-J400F
 • 
Visitou Há 5 horas
Onde consultar as criptomoedas a qye não foram listadas ainda? - Pesquisa Google
google.com
 • 
SM-J400F
 • 
Visitou Há 5 horas
Onde consultar as criptomoeadas a serem lisadas? - Pesquisa Google
google.com
 • 
SM-J400F
 • 
Visitou Há 5 horas" a oportunidade de participar do mercado de criptomoedas com confiança, por meio da gestão profissional da Bitget12. Nosso objectivo é simplificar o processo de investimento, garantindo transparência, segurança e distribuição justa dos lucros gerados.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Nossa Visão</h2>
              <p>Ser a principal referência global em plataformas de investimento em criptomoedas, reconhecida pela inovação, confiabilidade e compromisso com o sucesso financeiro dos nossos usuários.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">O Que Fazemo</h2>
              <p>Conectamos investidores á Bitget12, responsável pelo gerenciamento dos fundos aportados com estratégias avançadas e bem fundamentadas. Durante 365 dias, os lucros gerados são distribuídos mensalmente aos investidores, proporcionando uma experiência de investimento prática e orientada a resultados. Nosso modelo elimina a complexidade de negociar criptoativos diretamente, permitindo que os usuários se beneficiem do conhecimento e da expertise da Bitget12 no setor.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Nossos Valores</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Segurança:</strong> Adotamos tecnologias de ponta e práticas rigorosas para proteger os dados e os recursos dos nossos usuários.</li>
                <li><strong>Inovação:</strong> Buscamos constantemente novas estratégias e soluções para maximizar os resultados no dinâmico mercado de criptomoedas.</li>
                <li><strong>Confiança:</strong> Construímos relações sólidas com nossos investidores, baseadas em ética e responsabilidade.</li>
                <li><strong>Acessibilidade:</strong> Tornamos o investimento em criptomoedas disponível para todo, independentemente do nível de conhecimento ou experiência.</li>
              </ul>
            </div>
            
            <p className="mt-8 pt-4 text-center font-semibold text-gray-800 border-t">Junte-se a Nós</p>
            <p className="text-center font-semibold text-gray-800">Bitget12 – Transformando o futuros do investimento, um bloco de cada vez.</p>
          </CardContent>
        </Card>
      </main>
      <Footer variant="light" />
    </div>
  );
};

export default AboutUs;
