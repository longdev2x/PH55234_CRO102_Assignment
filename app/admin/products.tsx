import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';
import { api, Product, ProductCategory } from '@/services/api';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function ProductManagementScreen() {
    const router = useRouter();
    const user = useAppSelector(selectUser);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: '',
        category: 'cayTrong',
        image: '',
        quantity: '1'
    });

    // Load products
    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Create product
    const handleCreateProduct = async () => {
        try {
            setLoading(true);
            await api.createProduct(newProduct);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: 'cayTrong',
                image: '',
                quantity: '1'
            });
            loadProducts();
            Alert.alert('Success', 'Product created successfully');
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    // Update product
    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        try {
            setLoading(true);
            await api.updateProduct(editingProduct.id, editingProduct);
            setEditingProduct(null);
            loadProducts();
            Alert.alert('Success', 'Product updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const handleDeleteProduct = async (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await api.deleteProduct(id);
                            loadProducts();
                            Alert.alert('Success', 'Product deleted successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete product');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const categories: { label: string; value: ProductCategory }[] = [
        { label: 'Cây trồng', value: 'cayTrong' },
        { label: 'Chậu cây trồng', value: 'chauCayTrong' },
        { label: 'Phụ kiện', value: 'phuKien' },
        { label: 'Combo chăm sóc', value: 'comboChamSoc' }
    ];

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen 
                options={{ 
                    title: '',
                    headerShown: true
                }} 
            />

            {/* Add New Product */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Add New Product</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={newProduct.name}
                    onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={newProduct.description}
                    onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={newProduct.price}
                    onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                    keyboardType="numeric"
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={newProduct.category}
                        onValueChange={(value: ProductCategory) => 
                            setNewProduct({ ...newProduct, category: value })
                        }
                        style={styles.picker}
                    >
                        {categories.map((cat) => (
                            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                        ))}
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
                    keyboardType="numeric"
                />
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleCreateProduct}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Add Product</Text>
                </TouchableOpacity>
            </View>

            {/* Product List */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product List</Text>
                {products.map((product) => (
                    <View key={product.id} style={styles.productItem}>
                        <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            contentFit="cover"
                        />
                        {editingProduct?.id === product.id ? (
                            <View style={styles.editForm}>
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct.name}
                                    onChangeText={(text) => setEditingProduct({ ...editingProduct, name: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct.description}
                                    onChangeText={(text) => setEditingProduct({ ...editingProduct, description: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct.price}
                                    onChangeText={(text) => setEditingProduct({ ...editingProduct, price: text })}
                                    keyboardType="numeric"
                                />
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={editingProduct.category}
                                        onValueChange={(value: ProductCategory) => 
                                            setEditingProduct({ ...editingProduct, category: value })
                                        }
                                        style={styles.picker}
                                    >
                                        {categories.map((cat) => (
                                            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                                        ))}
                                    </Picker>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct.image}
                                    onChangeText={(text) => setEditingProduct({ ...editingProduct, image: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct.quantity}
                                    onChangeText={(text) => setEditingProduct({ ...editingProduct, quantity: text })}
                                    keyboardType="numeric"
                                />
                                <View style={styles.editButtons}>
                                    <TouchableOpacity 
                                        style={[styles.button, styles.saveButton]}
                                        onPress={handleUpdateProduct}
                                    >
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={() => setEditingProduct(null)}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>{product.price}</Text>
                                <Text style={styles.productCategory}>{
                                    categories.find(cat => cat.value === product.category)?.label
                                }</Text>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity 
                                        style={[styles.iconButton, styles.editButton]}
                                        onPress={() => setEditingProduct(product)}
                                    >
                                        <Ionicons name="pencil" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.iconButton, styles.deleteButton]}
                                        onPress={() => handleDeleteProduct(product.id)}
                                    >
                                        <Ionicons name="trash" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    productItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 200,
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#007AFF',
        marginTop: 4,
    },
    productCategory: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    editForm: {
        padding: 12,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    saveButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#34C759',
    },
    cancelButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#FF3B30',
    },
    headerButton: {
        padding: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
});
