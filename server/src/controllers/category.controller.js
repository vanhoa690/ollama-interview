import Category from "../models/category.model";

export async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (error) {
    return res.json({ error: error.message });
  }
}

export async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    return res.json({ error: error.message });
  }
}

export async function addCategory(req, res) {
  try {
    const newCategory = await Category.create(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    return res.json({ error: error.message });
  }
}
export async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
