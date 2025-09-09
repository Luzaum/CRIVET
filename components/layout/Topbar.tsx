import React from 'react'
import { Calculator, HelpCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme/ThemeToggle'

export function Topbar() {
  return (
    <div className="h-16 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li className="text-sm font-medium text-muted-foreground">
              Categoria
            </li>
            <li className="text-sm text-muted-foreground">
              <span className="mx-2">/</span>
              <span className="font-medium text-foreground">Fármaco</span>
            </li>
          </ol>
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" aria-label="Calculadora">
          <Calculator className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Ajuda">
          <HelpCircle className="h-5 w-5" />
        </Button>
        {/* Botão de tema – sempre visível */}
        <ThemeToggle />
      </div>
    </div>
  )
}
