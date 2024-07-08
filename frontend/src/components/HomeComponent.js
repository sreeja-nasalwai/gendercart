import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, Dropdown } from 'react-bootstrap';
import OptionsComponent from './OptionsComponent';
import '../ProductComponent.css';
import FooterComponent from './FooterComponent';

function HomeComponent() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [colorFilter, setColorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (colorFilter) {
      filtered = filtered.filter(product => product.color === colorFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(product => product.type === typeFilter);
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    if (genderFilter) {
      filtered = filtered.filter(product => product.gender === genderFilter);
    }

    setFilteredProducts(filtered);
  }, [colorFilter, typeFilter, priceFilter, genderFilter, products]);

  useEffect(() => {
    const searchFilteredProducts = products.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(searchFilteredProducts);
  }, [searchQuery, products]);

  const fetchProductData = async () => {
    try {
      const response = await axios.get("http://localhost:3002/home/");
      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSingleProduct = (id) => {
    navigate(`/homeproduct/${id}`);
  };

  return (
    <>
      <OptionsComponent />
      <br />

      <Container className="my-4">
        <Row>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <form className="col-3 mb-2 mb-lg-0" role="search" style={{ marginRight: '20px', backgroundColor: '#f2f2f2' }}>
              <input type="search" className="form-control" value={searchQuery} onChange={handleSearch} placeholder="Search..." aria-label="Search" />
            </form>
            <Col className="text-right">
              <Dropdown className="filter-dropdown">
                <Dropdown.Toggle style={{ color: 'purple', backgroundColor: '#f2f2f2', border: 'white' }} id="dropdown-basic">
                  Filters
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Form.Group controlId="colorFilter">
                    <Form.Label>Color</Form.Label>
                    <Form.Control as="select" value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}>
                      <option value="">All</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="pink">Pink</option>
                      <option value="black">Black</option>
                      <option value="yellow">Yellow</option>
                      <option value="white">White</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="typeFilter">
                    <Form.Label>Type</Form.Label>
                    <Form.Control as="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                      <option value="">All</option>
                      <option value="dress">Dress</option>
                      <option value="shirt">Shirt</option>
                      <option value="saree">Saree</option>
                      <option value="top">Top</option>
                      <option value="shoe">Shoe</option>
                      <option value="pant">Pant</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="priceFilter">
                    <Form.Label>Price</Form.Label>
                    <Form.Control as="select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                      <option value="">All</option>
                      <option value="100-500">100-500</option>
                      <option value="500-1000">500-1000</option>
                      <option value="1000-1500">1000-1500</option>
                      <option value="1500-2000">1500-2000</option>
                      <option value="2000-5000">2000-5000</option>
                      <option value="5000-10000">5000-10000</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="genderFilter">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control as="select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                      <option value="">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="kids">Kids</option>
                    </Form.Control>
                  </Form.Group>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </div>
        </Row>
        <Container style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card className="product-card" key={product._id} style={{ width: '20rem' }}>
                <Card.Img variant="top" src={product.imageUrl} style={{ height: '250px', width: '20rem' }} />
                <Card.Body>
                  <Card.Text>{product.productName}</Card.Text>
                  <Card.Text>Price: Rs {product.price}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="link" onClick={() => handleSingleProduct(product._id)}>See More</Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </Container>
      </Container>
    </>
  );
}

export default HomeComponent;
