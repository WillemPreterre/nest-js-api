import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Observable } from 'rxjs';
import { ProductInterface } from './product.interface';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class ProductService {

  constructor() {

  }

  // récupération du chemin vers le Json
  private filePath = path.join(__dirname, '../../src/database/product.json');
  // Récupération des données du json
  private json = fs.readFileSync(this.filePath, 'utf8');
  // Création du json avec l'interface
  private jsonData: ProductInterface[] = JSON.parse(this.json);

  private productId(id) {
    this.jsonData.findIndex(product => product.id === id)
  }
  create(productInterface: ProductInterface) {
    // if (titleExists) {
    //   throw new UnprocessableEntityException('Post title already exists.');
    // }
    // permet d'ajouter automatiquement un id en fonction du dernière élément créée
    const maxId: number = Math.max(...this.jsonData.map((product) => product.id), 0);
    const id: number = maxId + 1;
    // Permet d'ajouter l'id et les informations de mon produit 
    const createProduct: ProductInterface = {
      ...productInterface,
      id,
    };

    // Ajoute la nouvelle donnée dans le tableau
    this.jsonData.push(createProduct)
    //  conversion de ma donnée en json
    const objectToJson = JSON.stringify(this.jsonData)
    // Ajoute la donnée dans le json
    fs.writeFileSync(this.filePath, objectToJson)
    return objectToJson;
  }

  // récupération de tous les produits
  findAll(): Array<ProductInterface> {
    return this.jsonData
  }

  // Récupération d'un produit
  findOne(id: number) {
    const productId: ProductInterface = this.jsonData.find(product => product.id === id)
    return productId;
  }

  // Modification produit
  update(id: number, updateProductDto: UpdateProductDto) {
    const productId = this.jsonData.findIndex(product => product.id === id)

    
  }

  // Suppression produit
  remove(id: number) {
    // Récupération du produit que l'on veut supprimer
    const productId = this.jsonData.findIndex(product => product.id === id)
    // Suppression du produit
    this.jsonData.splice(productId, 1)
    // on update le json
    const objectToJson = JSON.stringify(this.jsonData)
    // Ajout des nouvelles valeurs
    fs.writeFileSync(this.filePath, objectToJson)

    return productId

  }
}
