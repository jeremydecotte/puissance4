import { Component, OnInit } from '@angular/core';
import { Game, TokenType } from '../core/game/Game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isWinned: boolean;
  game: Game;
  currentPlayer: TokenType = TokenType.YELLOW;

  tokenType = TokenType;

  resetGame(): void {
    this.isWinned = false;

    // On initialise la grille avec une matrice 7*7 vide.
    const canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.zIndex = "-1";
    ctx.clearRect(0, 0, 1200, 1200);

    this.game = new Game();
    this.game.IsWinned.subscribe(value => {
      console.log(value);
      if (value) // Si la partie est gagnée
      {
        this.isWinned = true;
        console.log(this.game.WinningTokens);

        // On calcule la position des points de la ligne
        // A voir avec le responsive comment calculer les hauteurs/largeur d'une case
        const tokenWidth = 125;
        const tokenHeight = 125;

        // Si la partie est finie, on entoure la série gagnante dans le canvas.
        canvas.style.zIndex = "10";
        ctx.beginPath(); ctx.globalAlpha = 0.2;
        ctx.lineWidth = tokenWidth - 8;
        ctx.lineCap = 'round';
        ctx.moveTo(
          (((this.game.WinningTokens[0].x + 1) * tokenWidth) - (tokenWidth / 2)) + 13,
          (((this.game.WinningTokens[0].y + 1) * tokenHeight) - (tokenHeight / 2))
        );
        ctx.lineTo(
          (((this.game.WinningTokens[3].x + 1) * tokenWidth) - (tokenWidth / 2)) + 13,
          (((this.game.WinningTokens[3].y + 1) * tokenHeight) - (tokenHeight / 2))
        );
        ctx.strokeStyle = 'rgb(255,15,15,1)';
        ctx.stroke();
      }
    });
  }

  addToken(columnIndex: number): void {
    this.game.addToken(columnIndex, this.currentPlayer);
    this.currentPlayer = (this.currentPlayer == TokenType.RED) ? TokenType.YELLOW : TokenType.RED;
  }

  ngOnInit(): void {
    this.resetGame();
  }
}

