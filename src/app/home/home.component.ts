import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private playedPillsNumber: number = 0;

  grid: any[][] = [];
  currentPlayer: PillType = PillType.YELLOW;

  PillType = PillType;

  constructor() {
    // On initialise la grille avec une matrice 7*7 vide.
    this.grid = new Array(7).fill(null).map((x, i) => new Array(7).fill(null).map(() => ({ value: null })));
  }

  addPills(columnIndex: number): void {
    let lastEmptyIndex = -1, index = 6;

    for (; index >= 0; index--) {
      if (this.grid[columnIndex][index].value === null) {
        lastEmptyIndex = index;
        break;
      }
    }

    if (lastEmptyIndex >= 0 && lastEmptyIndex < 7) {
      this.grid[columnIndex][lastEmptyIndex] = { value: this.currentPlayer };
      this.playedPillsNumber++;

      console.log('Verify : ' + this.verify(columnIndex, lastEmptyIndex, this.currentPlayer));
      
      this.currentPlayer = (this.currentPlayer == PillType.RED) ? PillType.YELLOW : PillType.RED;
    }
  }

  private verify(lastColumnIndex: number, lastCellIndex: number, value: PillType): boolean {
    // On recherche à proximité les pills horizontales ou verticales de même couleur.
    let result: boolean = false;
    let nearSamePillColorCount = 0;

    // Si il y a moins de 7 jetons sur le plateau, on ne vérifie rien (c'est impossible de gagner !)
    if (this.playedPillsNumber < 7) return false;
    // Si il y a moins de 4 jetons sur la ligne ou sur la colonne, on ne vérifie rien (c'est impossible de gagner !)

    // On commence par vérifier la ligne du dernier jeton ajouté.
    for (let i = 0; i < 7; i++) {
      if (this.grid[i][lastCellIndex].value == value) {
        nearSamePillColorCount++;
      }
      else {
        nearSamePillColorCount = 0;
      }
      //console.log(`Index : ${i} // Cell : ${lastCellIndex} // Value : ${this.grid[i][lastCellIndex].value} // Valeur recherchée : ${value} // Nb pills proche : ${nearSamePillColorCount}`)
      if (nearSamePillColorCount == 4) {
        result = true;
        break;
      }
    }

    // Si on ne trouve rien, on vérifie la colonne du dernier jeton ajouté.
    if (!result) {
      nearSamePillColorCount = 0;
      for (let i = 6; i >= 0; i--) {
        // Si la valeur de la cellule est nulle, ça ne sert à rien d'aller plus loin.
        if (this.grid[lastColumnIndex][i].value === null) break;
        
        if (this.grid[lastColumnIndex][i].value == value) {
          nearSamePillColorCount++;
        }
        else {
          nearSamePillColorCount = 0;
        }
        console.log(`Index : ${lastColumnIndex} // Cell : ${i} // Value : ${this.grid[i][lastCellIndex].value} // Valeur recherchée : ${value} // Nb pills proche : ${nearSamePillColorCount}`)
        if (nearSamePillColorCount == 4) {
          result = true;
          break;
        }
      }
    }

    // Si on a toujours rien trouvé, on se lance dans la vérification des diagonales par rapport au dernier jeton ajouté.
    if (!result) {
      nearSamePillColorCount = 0;
    }


    return result;
  }

  ngOnInit(): void {
  }

}

export enum PillType {
  YELLOW,
  RED
}
