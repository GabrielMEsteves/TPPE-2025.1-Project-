"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"
import { Bus, User, Settings, ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
            <Bus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Protótipo de
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Viagens
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore nossa plataforma de gerenciamento de viagens. Selecione o fluxo que deseja visualizar para começar.
          </p>
        </div>

        {/* Cards de seleção */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card Usuário */}
          <Card
            className={`group relative overflow-hidden bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer ${
              hoveredCard === "user" ? "scale-105 shadow-2xl shadow-cyan-500/20" : ""
            }`}
            onMouseEnter={() => setHoveredCard("user")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleNavigation("/login")}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-cyan-500/25 transition-shadow duration-300">
                  <User className="w-8 h-8 text-white" />
                </div>
                <ArrowRight
                  className={`w-6 h-6 text-slate-400 transition-all duration-300 ${
                    hoveredCard === "user" ? "translate-x-1 text-cyan-400" : ""
                  }`}
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                Área do Usuário
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Acesse sua conta, visualize suas viagens, faça reservas e gerencie seu perfil de viajante.
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4" />
                <span>Interface intuitiva e moderna</span>
              </div>
            </CardContent>

            {/* Efeito de hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Card>

          {/* Card Admin */}
          <Card
            className={`group relative overflow-hidden bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer ${
              hoveredCard === "admin" ? "scale-105 shadow-2xl shadow-blue-500/20" : ""
            }`}
            onMouseEnter={() => setHoveredCard("admin")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleNavigation("/admin/login")}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <ArrowRight
                  className={`w-6 h-6 text-slate-400 transition-all duration-300 ${
                    hoveredCard === "admin" ? "translate-x-1 text-blue-400" : ""
                  }`}
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                Área do Admin
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Painel administrativo completo para gerenciar usuários, viagens, relatórios e configurações do sistema.
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4" />
                <span>Controle total da plataforma</span>
              </div>
            </CardContent>

            {/* Efeito de hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">Desenvolvido com React + Vite • Protótipo v1.0</p>
        </div>
      </div>
    </div>
  )
}
