import React, { useState } from 'react';
import { Table, Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const DUMMY_BOOKS = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
];

function BookManager() {
  const [books, setBooks] = useState(DUMMY_BOOKS);
  // State untuk form input
  const [currentBook, setCurrentBook] = useState({ id: null, title: '', author: '', year: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // 1. Tangani perubahan input form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentBook({ ...currentBook, [name]: value });
  };

  // 2. Logika Tambah/Update
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentBook.title || !currentBook.author || !currentBook.year) {
      setError("Semua kolom harus diisi!");
      return; 
    }
    setError('');

    if (isEditing) {
      // UPDATE: Cari buku dan ganti datanya
      setBooks(books.map(book => 
        book.id === currentBook.id ? currentBook : book
      ));
      setIsEditing(false); // Selesai Edit
    } else {
      // CREATE: Tambahkan buku baru
      const newBook = { 
        ...currentBook, 
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1 
      };
      setBooks([...books, newBook]);
    }
    // Reset form
    setCurrentBook({ id: null, title: '', author: '', year: '' });
  };

  // 3. Logika Hapus
  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // 4. Logika Mulai Edit
  const handleEdit = (book) => {
    setIsEditing(true);
    setCurrentBook(book); // Isi form dengan data buku yang dipilih
  };

  // 5. Batal Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentBook({ id: null, title: '', author: '', year: '' });
    setError('');
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Manajemen Buku</h1>
      
      {/* BAGIAN FORMULIR (CREATE & UPDATE) */}
      <Card className="mb-4 p-4 shadow-sm">
        <h2 className="mb-3">{isEditing ? '✏️ Edit Buku' : 'Tambah Buku Baru'}</h2>
        
        {error && <Alert variant="danger">{error}</Alert>} {/* Tampilkan Error */}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Judul Buku"
                  name="title"
                  value={currentBook.title || ''} 
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Penulis"
                  name="author"
                  value={currentBook.author || ''} 
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Tahun"
                  name="year"
                  value={currentBook.year || ''} 
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant={isEditing ? 'warning' : 'primary'} type="submit" className="w-100">
                {isEditing ? 'Update' : 'Tambah'}
              </Button>
            </Col>
          </Row>
          {isEditing && (
            <Button variant="secondary" onClick={handleCancelEdit} className="mt-2">
              Batal Edit
            </Button>
          )}
        </Form>
      </Card>

      <h2 className="mb-3 mt-5">📚 Daftar Semua Buku ({books.length})</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Tahun</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map(book => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.year}</td>
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Belum ada data buku.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default BookManager;