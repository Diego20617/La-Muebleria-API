import producto_model from "../models/Producto_model.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
    createProductoSchema,
    getProductoSchema,
    updateProductoSchema,
    deleteProductoSchema,
} from "../validators/ProductoValidatorDTO.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     producto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado en la BD
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         category:
 *           type: string
 *           description: Categoria del producto
 *         price:
 *           type: string
 *           description: Precio del producto
 *         stock:
 *           type: string
 *           description: Stock del producto
 *         description:
 *           type: string
 *           description: Descripcion del producto
 *         color:
 *           type: string
 *           description: Color del producto
 *         dimensions:
 *           type: object
 *           properties:
 *             height:
 *               type: string
 *               description: Alto (cm)
 *             width:
 *               type: string
 *               description: Ancho (cm)
 *             depth:
 *               type: string
 *               description: Profundidad (cm)
 *           description: Dimensiones del producto
 *         imageUrl:
 *           type: string
 *           description: URL de la imagen del producto
 *         tipo_producto:
 *           type: string
 *           description: Del tipo de producto relacionado
 *       required:
 *         - name
 *         - price
 *         - description
 *       example:
 *         name: armario
 *         category: Muebles
 *         price: "150.00"
 *         stock: "50"
 *         description: mueble de madera
 *         color: Marrón
 *         dimensions:
 *           height: "180"
 *           width: "80"
 *           depth: "50"
 *         imageUrl: "https://ejemplo.com/imagen.jpg"
 *         tipo_producto_id: 674538b861d4d2be66b1dde0
 */

//1. Crear producto
export const createProducto = [
    validatorHandler(createProductoSchema, "body"),
    async (req, res) => {
        try {
            const producto = new producto_model(req.body);
            await producto.save();
            res.status(201).json(producto); // Código 201 para indicar creación exitosa
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
];

//2. Obtener todos los productos
export const getProducto = async (req, resp) => {
    try {
        const productos = await producto_model.find();
        resp.json(productos);
    } catch (error) {
        resp.status(500).json({ message: error.message });
    }
};

//3. Obtener producto por ID
export const getAllProducto = [
    validatorHandler(getProductoSchema, "params"),
    async (req, resp) => {
        const { id } = req.params;
        try {
            const producto = await producto_model.findById(id);
            if (!producto) {
                return resp.status(404).json({ message: "Producto no encontrado" });
            }
            resp.json(producto);
        } catch (error) {
            resp.status(500).json({ message: error.message });
        }
    },
];

//4. Obtener producto por ID con tipo de producto relacionado
export const getAllProductoWithTipProducto = [
    validatorHandler(getProductoSchema, "params"),
    async (req, resp) => {
        const { id } = req.params;
        try {
            const producto = await producto_model.findById(id).populate("tipo_producto"); // Usar populate para incluir el tipo de producto relacionado
            if (!producto) {
                return resp.status(404).json({ message: "Producto no encontrado" });
            }
            resp.json(producto);
        } catch (error) {
            resp.status(500).json({ message: error.message });
        }
    },
];

//5. Actualizar producto
export const updateProducto = [
    validatorHandler(getProductoSchema, "params"),
    validatorHandler(updateProductoSchema, "body"),
    async (req, resp) => {
        const { id } = req.params;
        try {
            const updatedProducto = await producto_model.findByIdAndUpdate(id, req.body, { new: true }); // Usar findByIdAndUpdate directamente
            if (!updatedProducto) {
                return resp.status(404).json({ message: "Producto no encontrado" });
            }
            resp.status(200).json({ message: "Producto actualizado correctamente", data: updatedProducto });
        } catch (error) {
            resp.status(500).json({ message: error.message });
        }
    },
];

//6. Borrar producto
export const deleteProducto = [
    validatorHandler(deleteProductoSchema, "params"),
    async (req, resp) => {
        const { id } = req.params;
        try {
            const result = await producto_model.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return resp.status(404).json({ message: "Producto no encontrado" });
            }
            return resp.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            return resp.status(500).json({ message: error.message });
        }
    },
];
