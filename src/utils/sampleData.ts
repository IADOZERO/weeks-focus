import { Vision, Cycle, Objective, Action, WeeklyReview } from "@/types";

export const createSampleVision = (): Vision => ({
  id: "sample-vision-1",
  title: "Tornar-me um especialista reconhecido em React",
  description: "Quero ser reconhecido como um desenvolvedor React sênior, com pelo menos 50 projetos no portfólio, 5000 seguidores no LinkedIn compartilhando conhecimento técnico, e estar palestrando em pelo menos 3 conferências de tecnologia por ano.",
  category: "professional",
  timeframe: "3-years",
  createdAt: new Date()
});

export const createSampleCycle = (visionId: string): Cycle => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + (12 * 7)); // 12 weeks

  const objectives: Objective[] = [
    {
      id: "obj-1",
      title: "Completar 3 projetos React avançados",
      description: "Desenvolver 3 projetos complexos usando React 18, TypeScript e bibliotecas modernas",
      measurable: "3 projetos publicados no GitHub com documentação completa",
      deadline: endDate,
      visionId,
      completed: false,
      actions: [
        {
          id: "action-1",
          title: "Planejar arquitetura do projeto 1 - E-commerce",
          description: "Definir stack tecnológica, estrutura de pastas e componentes principais",
          weekNumber: 1,
          priority: "high",
          estimatedTime: 4,
          completed: false,
          objectiveId: "obj-1"
        },
        {
          id: "action-2", 
          title: "Implementar autenticação e carrinho de compras",
          description: "Sistema completo de login/logout e carrinho persistente",
          weekNumber: 2,
          priority: "high",
          estimatedTime: 8,
          completed: false,
          objectiveId: "obj-1"
        },
        {
          id: "action-3",
          title: "Integrar API de pagamentos",
          weekNumber: 3,
          priority: "medium",
          estimatedTime: 6,
          completed: false,
          objectiveId: "obj-1"
        }
      ]
    },
    {
      id: "obj-2", 
      title: "Publicar 8 artigos técnicos no LinkedIn",
      description: "Compartilhar conhecimento através de artigos sobre React, performance e boas práticas",
      measurable: "8 artigos publicados com pelo menos 100 engajamentos cada",
      deadline: endDate,
      visionId,
      completed: false,
      actions: [
        {
          id: "action-4",
          title: "Escrever artigo sobre React Server Components",
          weekNumber: 1,
          priority: "medium",
          estimatedTime: 3,
          completed: true,
          completedAt: new Date(),
          objectiveId: "obj-2"
        },
        {
          id: "action-5",
          title: "Artigo sobre otimização de performance",
          weekNumber: 2, 
          priority: "medium",
          estimatedTime: 3,
          completed: false,
          objectiveId: "obj-2"
        }
      ]
    },
    {
      id: "obj-3",
      title: "Contribuir para 2 projetos open source",
      description: "Fazer contribuições significativas para bibliotecas React populares",
      measurable: "2 pull requests aceitos em projetos com 1000+ estrelas",
      deadline: endDate,
      visionId,
      completed: false,
      actions: [
        {
          id: "action-6",
          title: "Identificar issues para contribuir no React Router",
          weekNumber: 4,
          priority: "low",
          estimatedTime: 2,
          completed: false,
          objectiveId: "obj-3"
        }
      ]
    }
  ];

  const weeklyReviews: WeeklyReview[] = [
    {
      id: "review-1",
      weekNumber: 1,
      cycleId: "sample-cycle-1",
      completionRate: 80,
      obstacles: ["Falta de tempo", "Dificuldade com nova API"],
      adjustments: ["Acordar 1h mais cedo", "Estudar documentação"],
      learnings: ["Importância do planejamento", "Valor da consistência"],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "review-2", 
      weekNumber: 2,
      cycleId: "sample-cycle-1",
      completionRate: 90,
      obstacles: ["Reuniões extras"],
      adjustments: ["Bloquear tempo no calendário"],
      learnings: ["Proteção do tempo é essencial"],
      createdAt: new Date()
    }
  ];

  return {
    id: "sample-cycle-1",
    name: "Q1 2025 - Foco em React",
    startDate,
    endDate,
    status: "active",
    objectives,
    weeklyReviews
  };
};

export const initializeSampleData = () => {
  // Check if data already exists
  const existingVisions = localStorage.getItem('twelve-week-visions');
  const existingCycles = localStorage.getItem('twelve-week-cycles');
  
  if (!existingVisions || JSON.parse(existingVisions).length === 0) {
    const sampleVision = createSampleVision();
    const sampleCycle = createSampleCycle(sampleVision.id);
    
    localStorage.setItem('twelve-week-visions', JSON.stringify([sampleVision]));
    localStorage.setItem('twelve-week-cycles', JSON.stringify([sampleCycle]));
    localStorage.setItem('twelve-week-current-cycle', JSON.stringify(sampleCycle.id));
  }
};