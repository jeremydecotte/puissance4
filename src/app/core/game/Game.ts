import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class Game {
    private playedPillsNumber: number = 0;

    public WinningTokens: any[] = [];
    public IsWinned: Subject<boolean> = new Subject<boolean>();
    public IsDraw: Subject<boolean> = new Subject<boolean>();
    public Grid: any[][] = [];

    constructor() {
        this.Grid = new Array(7).fill(null).map((x, i) => new Array(7).fill(null).map(() => ({ value: null })));
    }

    addToken(columnIndex: number, tokenType: TokenType): void {
        let lastEmptyRowIndex = -1, index = 6;

        for (; index >= 0; index--) {
            if (this.Grid[columnIndex][index].value === null) {
                lastEmptyRowIndex = index;
                break;
            }
        }

        if (lastEmptyRowIndex >= 0 && lastEmptyRowIndex < 7) {
            this.Grid[columnIndex][lastEmptyRowIndex] = { value: tokenType };
            this.playedPillsNumber++;

            const res = this.getWinningTokens(columnIndex, lastEmptyRowIndex, tokenType);
            if (res.length === 4) {
                console.log("c'est gagné !");
                this.IsWinned.next(true);
                this.WinningTokens = res;
            }
        }
    }

    private getWinningTokens(columnIndex: number, rowIndex: number, value: TokenType): any[] {
        // On recherche à proximité les pills horizontales ou verticales de même couleur.
        let result: boolean;
        let nearSameTokenColorCount = 0;
        let winningTokens: any[] = [];

        //console.log(`${columnIndex} // ${rowIndex}`);

        // Si il y a moins de 7 jetons sur le plateau, on ne vérifie rien (c'est impossible de gagner !)
        if (this.playedPillsNumber < 7) return winningTokens;
        // Si il y a moins de 4 jetons sur la ligne ou sur la colonne, on ne vérifie rien (c'est impossible de gagner !)

        // On commence par vérifier la ligne du dernier jeton ajouté.
        for (let i = 0; i < 7; i++) {
            if (this.Grid[i][rowIndex].value === value) {
                nearSameTokenColorCount++;
                winningTokens.push({ x: i, y: rowIndex });
            }
            else {
                nearSameTokenColorCount = 0;
            }
            if (nearSameTokenColorCount === 4) {
                result = true;
                break;
            }
        }
        
        // Si on ne trouve rien, on vérifie la colonne du dernier jeton ajouté.
        if (!result) {
            nearSameTokenColorCount = 0;
            winningTokens = [];
            
            // Si la valeur de la cellule est nulle, ça ne sert à rien d'aller plus loin.            
            for (let i = 6; i >= 0; i--) {
                if (this.Grid[columnIndex][i].value === null) break;
                
                if (this.Grid[columnIndex][i].value === value) {
                    nearSameTokenColorCount++;
                    winningTokens.push({ x: columnIndex, y: i });
                }
                else {
                    nearSameTokenColorCount = 0;
                }
                if (nearSameTokenColorCount === 4) {
                    result = true;
                    break;
                }
            }
        }

        console.log(result);
        
        // Si on a toujours rien trouvé, on se lance dans la vérification des diagonales par rapport au dernier jeton ajouté.
        if (!result) {
            nearSameTokenColorCount = 0;
            winningTokens = [];

            // On cherche à connaitre la distance du bord gauche pour calculer à partir de quelle case vérifier la diagonale.
            let startDiagRowIndex = ((rowIndex - columnIndex) >= 0) ? (rowIndex - columnIndex) : 0;
            // On test de haut en bas, de gauche à droite
            for (let i = 0; i < 7; i++) {

                if (this.Grid[i][startDiagRowIndex].value === value) {
                    nearSameTokenColorCount++;
                    winningTokens.push({ x: i, y: startDiagRowIndex });
                }
                else {
                    nearSameTokenColorCount = 0;
                }

                if (nearSameTokenColorCount === 4) {
                    result = true;
                    break;
                }
                else if (startDiagRowIndex === 6) {
                    break;
                }
                else {
                    startDiagRowIndex++;
                }
            }
        }

        if (!result) {
            let startDiagRowIndex = ((rowIndex - (6 - columnIndex)) >= 0) ? (rowIndex - (6 - columnIndex)) : 0;

            nearSameTokenColorCount = 0;
            winningTokens = [];

            // Puis de haut en bas, mais de droite à gauche
            for (let i = 6; i >= 0; i--) {
                if (this.Grid[i][startDiagRowIndex].value === value) {
                    nearSameTokenColorCount++;
                    winningTokens.push({ x: i, y: startDiagRowIndex });
                }
                else {
                    nearSameTokenColorCount = 0;
                }

                if (nearSameTokenColorCount === 4) {
                    result = true;
                    break;
                }
                else if (startDiagRowIndex === 6) {
                    break;
                }
                else {
                    startDiagRowIndex++;
                }
            }
        }
        
        this.WinningTokens = winningTokens;

        return winningTokens;
    }

}

export enum TokenType {
    YELLOW,
    RED
}
