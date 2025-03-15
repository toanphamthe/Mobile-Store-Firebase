import React, { useState, useEffect } from "react";
import './CustomerManagement.css';
import { doc, addDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

export function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [editCustomer, setEditCustomer] = useState(null);
    const [newCustomer, setNewCustomer] = useState({ userName: "", email: "", phone: "", role: "User" });

    // Lấy danh sách khách hàng từ Firestore
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomers(usersList);
            } catch (error) {
                console.error("❌ Lỗi khi lấy khách hàng:", error);
            }
        };
        fetchCustomers();
    }, []);

    // Tìm kiếm khách hàng
    const filteredCustomers = customers.filter(user =>
        user.userName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    // Cập nhật thông tin khách hàng
    const updateCustomer = async (id, newData) => {
        try {
            const userRef = doc(db, "users", id);
            await updateDoc(userRef, newData);
            setCustomers(customers.map(user => (user.id === id ? { ...user, ...newData } : user)));
            setEditCustomer(null);
            Swal.fire("Thành công!", "Thông tin khách hàng đã được cập nhật.", "success");
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật:", error);
        }
    };

    // Xóa khách hàng
    const deleteCustomer = async (id) => {
        const confirm = await Swal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy"
        });

        if (confirm.isConfirmed) {
            try {
                await deleteDoc(doc(db, "users", id));
                setCustomers(customers.filter(user => user.id !== id));
                Swal.fire("Đã xóa!", "Khách hàng đã bị xóa.", "success");
            } catch (error) {
                console.error("❌ Lỗi khi xóa:", error);
            }
        }
    };

    // Cập nhật thông tin khách hàng khi bấm nút sửa
    const handleEditCustomer = (user) => {
        setEditCustomer(user);
    };

    // Thêm khách hàng mới
    const addCustomer = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "users"), newCustomer);
            setCustomers([...customers, { id: docRef.id, ...newCustomer }]);
            setNewCustomer({ userName: "", email: "", phone: "", role: "User" });
            Swal.fire("Thành công!", "Khách hàng mới đã được thêm.", "success");
        } catch (error) {
            console.error("❌ Lỗi khi thêm khách hàng:", error);
        }
    };

    return (
        <div className="container">
            <h2>Quản lý khách hàng</h2>
            <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Form thêm khách hàng */}
            <div className="add-form">
                <h3>Thêm khách hàng mới</h3>
                <form onSubmit={addCustomer}>
                    <input
                        type="text"
                        placeholder="Tên khách hàng"
                        value={newCustomer.userName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, userName: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        required
                    />
                    <select
                        value={newCustomer.role}
                        onChange={(e) => setNewCustomer({ ...newCustomer, role: e.target.value })}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button type="submit">Thêm khách hàng</button>
                </form>
            </div>

            {/* Form sửa khách hàng */}
            {editCustomer ? (
                <div className="edit-form">
                    <h3>Sửa thông tin khách hàng</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateCustomer(editCustomer.id, {
                                userName: editCustomer.userName,
                                email: editCustomer.email,
                                phone: editCustomer.phone
                            });
                        }}
                    >
                        <label>Tên:</label>
                        <input
                            type="text"
                            value={editCustomer.userName}
                            onChange={(e) => setEditCustomer({ ...editCustomer, userName: e.target.value })}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={editCustomer.email}
                            onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                        />
                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            value={editCustomer.phone}
                            onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                        />
                        <button type="submit">Lưu thay đổi</button>
                        <button type="button" onClick={() => setEditCustomer(null)}>Hủy</button>
                    </form>
                </div>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Vai trò</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleEditCustomer(user)}>✏️ Sửa</button>
                                    <button onClick={() => deleteCustomer(user.id)}>🗑️ Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
