import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Observable } from 'rxjs';
import { ProductInterface } from './product.interface';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class ProductService {

  constructor() { }

  // récupération du chemin vers le Json
  private filePath = path.join(__dirname, '../../src/database/product.json');
  // Récupération des données du json
  private json = fs.readFileSync(this.filePath, 'utf8');
  // Création du json avec l'interface
  private jsonData: ProductInterface[] = JSON.parse(this.json);

    // Function pour les messages d'erreurs
    errorReport(error) {
      throw new UnprocessableEntityException(error);
    }
    // Converti le js en json
    stringifyJSON(data) {
       return JSON.stringify(data)
    }

    addToJson(objectToJson) {
      fs.writeFileSync(this.filePath, objectToJson)

    }


  create(productInterface: ProductInterface) {

    // permet d'ajouter automatiquement un id en fonction du dernière élément créée
    const maxId: number = Math.max(...this.jsonData.map((product) => product.id), 0);
    const id: number = maxId + 1;
    // Permet d'ajouter l'id et les informations de mon produit 
    const createProduct: ProductInterface = {
      ...productInterface,
      id,
    }
    // Ajoute la nouvelle donnée dans l'array
    this.jsonData.push(createProduct)
    //  conversion de ma donnée en json
    const objectToJson = this.stringifyJSON(this.jsonData)
    // Ajoute la donnée dans le json
    this.addToJson(objectToJson)
    return objectToJson;
  }

  // récupération de tous les produits
  findAll(): Array<ProductInterface> {
    // récupérer seulement les articles disponible
    const filterProduct = this.jsonData.filter(produit => produit.quantity > 0)
    return filterProduct
  }

  // Récupération d'un produit
  findOne(id: number) {
    // récupération du produit souhaité grâce à l'id
    const productId: ProductInterface = this.jsonData.find(product => product.id === id)
    // Erreur si l'id n'existe pas
    if (productId === undefined) {
      this.errorReport("ce produit n'existe pas")
    }
    return productId;
  }

  // Modification produit
  update(id: number, updateProductDto: UpdateProductDto) {
    const productId = this.jsonData.findIndex(product => product.id === id)
    if (productId === undefined) {
      this.errorReport("ce produit n'existe pas")
    }
  }

  // Suppression produit
  remove(id: number) {
    // Récupération du produit que l'on veut supprimer
    const productId = this.jsonData.findIndex(product => product.id === id)

    // Erreur si le produit n'existe pas
    if (productId === -1) {
      this.errorReport("ce produit n'existe pas")
    }
    // Suppression du produit avec l'id
    this.jsonData.splice(productId, 1)
    // on update le json
    const objectToJson = this.stringifyJSON(this.jsonData)
    // Ajout du nouveau tableau
    this.addToJson(objectToJson)
    return productId
  }
}
