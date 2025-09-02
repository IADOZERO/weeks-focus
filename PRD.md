# Documento de Requisitos do Produto (PRD) - Sistema de Produtividade Pessoal

## 1. Introdução/Resumo

Este documento descreve os requisitos para um sistema de produtividade pessoal projetado para ajudar os usuários a alcançar seus objetivos de longo prazo através de um método estruturado de planejamento e execução. A aplicação se baseia em um ciclo de definição de uma visão de longo prazo, que é então desdobrada em ciclos de planejamento de 12 semanas, com um número limitado de objetivos para garantir foco e eficácia.

## 2. Público-alvo

Indivíduos que buscam uma abordagem estruturada para o desenvolvimento pessoal e profissional. Isso inclui, mas não se limita a:

*   **Profissionais e Empreendedores:** Que desejam alinhar suas atividades diárias com metas de carreira de longo prazo.
*   **Estudantes:** Que precisam gerenciar seus estudos e projetos pessoais de forma organizada.
*   **Qualquer pessoa interessada em autoaperfeiçoamento:** Que busca uma ferramenta para transformar visões em ações concretas.

## 3. Visão Geral do Produto

A aplicação é uma plataforma digital que guia os usuários através de um processo de produtividade cíclico e iterativo. O objetivo é fornecer clareza, foco e um caminho acionável para o crescimento pessoal e profissional. A metodologia central é dividida em cinco fases principais:

1.  **Visão:** Definir uma visão clara e inspiradora para o futuro (2-3 anos).
2.  **Objetivos:** Traduzir a visão em 2-3 objetivos concretos e mensuráveis para um ciclo de 12 semanas.
3.  **Planejamento:** Detalhar as ações e tarefas necessárias para alcançar cada objetivo.
4.  **Execução:** Focar na execução diária e semanal das tarefas planejadas.
5.  **Revisão:** Avaliar o progresso ao final de cada semana e de cada ciclo, ajustando o plano conforme necessário.

## 4. Funcionalidades Principais

### 4.1. Gestão de Visão (Vision Page)

*   **Criar Visão:** Os usuários podem criar múltiplas visões de longo prazo.
*   **Atributos da Visão:** Cada visão deve ter:
    *   **Título:** Um nome claro para a visão.
    *   **Descrição:** Detalhes sobre o que o usuário deseja alcançar.
    *   **Categoria:** (Ex: Profissional, Pessoal, Financeira, Saúde, Relacionamentos).
    *   **Prazo:** (Ex: 2 anos, 3 anos).
*   **Visualizar Visões:** Todas as visões criadas são exibidas em um layout de cartões para fácil visualização.
*   **Editar e Excluir:** Os usuários podem editar ou excluir visões existentes.

### 4.2. Planejamento de Ciclos (Cycle Planning)

*   **Ciclos de 12 Semanas:** O sistema opera em ciclos fixos de 12 semanas.
*   **Ciclo Ativo:** Deve haver o conceito de um "ciclo atual" ou "ativo".
*   **Criar Ciclo:** Os usuários podem iniciar um novo ciclo, que se tornará o ciclo ativo.
*   **Nome do Ciclo:** Cada ciclo pode receber um nome para fácil identificação (ex: "Q3 2025").

### 4.3. Definição de Objetivos (Objectives Page)

*   **Criar Objetivos:** Dentro de um ciclo ativo, os usuários podem definir seus objetivos.
*   **Limite de Objetivos:** Os usuários são limitados a um máximo de 3 objetivos por ciclo para manter o foco.
*   **Atributos do Objetivo:** Cada objetivo deve ter:
    *   **Título:** Uma descrição clara e concisa do objetivo.
    *   **Link com a Visão:** A capacidade de associar o objetivo a uma das visões de longo prazo.
    *   **Métrica de Sucesso:** Um critério claro para medir o sucesso (ex: "Publicar 12 artigos no blog").
    *   **Status:** (Ex: Em andamento, Concluído).
*   **Visualizar Objetivos:** Os objetivos do ciclo atual são exibidos de forma proeminente.
*   **Editar, Excluir e Marcar como Concluído:** Os usuários podem gerenciar seus objetivos ao longo do ciclo.

### 4.4. Execução e Acompanhamento (Execution Page)

*   **Ações/Tarefas:** Os usuários podem quebrar cada objetivo em ações ou tarefas menores e gerenciáveis.
*   **Atributos da Ação:** Cada ação deve ter:
    *   **Descrição:** O que precisa ser feito.
    *   **Status:** (Ex: A fazer, Em andamento, Concluído).
    *   **Data de Vencimento (Opcional):** Um prazo para a conclusão da tarefa.
*   **Visualização Diária/Semanal:** Uma interface para visualizar e gerenciar as tarefas planejadas para a semana.

### 4.5. Revisão e Retrospectiva (Reviews Page)

*   **Revisão Semanal:** Ao final de cada semana, o sistema deve solicitar ao usuário que revise seu progresso.
    *   **Pontuação de Desempenho:** O usuário pode dar uma nota para sua performance na semana.
    *   **Reflexão:** Campos para registrar o que deu certo, o que deu errado e o que pode ser melhorado.
*   **Revisão do Ciclo:** Ao final do ciclo de 12 semanas, uma revisão mais aprofundada é realizada para avaliar o progresso em relação aos objetivos e planejar o próximo ciclo.

## 5. Fluxo do Usuário

1.  **Onboarding/Primeiro Acesso:** Um novo usuário é guiado para criar sua primeira visão.
2.  **Criação da Visão:** O usuário define suas visões de longo prazo em diferentes áreas da vida.
3.  **Início do Ciclo:** O usuário inicia seu primeiro ciclo de 12 semanas.
4.  **Definição de Objetivos:** O usuário seleciona até 3 objetivos para focar durante o ciclo, alinhados com suas visões.
5.  **Planejamento de Ações:** O usuário detalha as tarefas semanais para cada objetivo.
6.  **Execução:** O usuário trabalha nas tarefas e atualiza seu status.
7.  **Revisão Semanal:** Ao final da semana, o usuário reflete sobre seu progresso.
8.  **Fim do Ciclo:** O usuário realiza uma retrospectiva completa, celebra as vitórias, aprende com os desafios e se prepara para o próximo ciclo.

## 6. Requisitos Não-Funcionais

*   **Tecnologia:** A aplicação é construída usando:
    *   **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui.
    *   **Backend/Banco de Dados:** Supabase.
*   **Performance:** A interface deve ser rápida e responsiva.
*   **Usabilidade:** A aplicação deve ser intuitiva e fácil de usar, com um design limpo e moderno.
*   **Persistência de Dados:** Todos os dados do usuário (visões, objetivos, etc.) devem ser salvos de forma segura no banco de dados.
*   **Autenticação:** Os usuários devem poder criar uma conta e fazer login para acessar seus dados.
