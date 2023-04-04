import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Toolbar({
    setSelectedCollection,
    setSelectedFriend,
    setSelectedDate,
    setSortCriteria,
    setSortAscending,
    sortAscending,
    collections,
    friends,
    sortCriteria,
    selectedDate,
    selectedFriend,
    selectedCollection
  }) {
  const handleSortDirection = () => {
    setSortAscending(!sortAscending);
  };

  const sortCriteriaLabels = {
    created: 'Fecha de creación',
    modified: 'Fecha de modificación',
    title: 'Título',
  };

  const filterDateLabels = {
    ever: 'Siempre',
    recently: 'Recientes',
    today: 'Hoy',
    this_week: 'Esta semana',
    this_month: 'Este mes',
    this_year: 'Este año',
    older: 'Más antiguas',
  };

  return (
    <div className="toolbar d-flex justify-content-between">
      <div className="filters d-flex">
        <Dropdown
          onSelect={(collectionId) => {
            if (collectionId === '') {
              setSelectedCollection(null);
              return;
            }
            const selected = collections.find(
              (collection) => collection._id.$oid === collectionId
            );
            setSelectedCollection(selected);
          }}
        >
          <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
            Colección
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item key="all" eventKey="">
              Todas
            </Dropdown.Item>
            {collections.map((collection) => (
              <Dropdown.Item key={collection._id.$oid} eventKey={collection._id.$oid}>
                {collection.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
  
        <Dropdown
          onSelect={(friendId) => {
            if (friendId === '') {
              setSelectedFriend(null);
              return;
            }
            const selected = friends.find(
              (friend) => friend._id.$oid === friendId
            );
            setSelectedFriend(selected);
          }}
        >
          <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
            Amigo
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item key="all" eventKey="">
              Todos
            </Dropdown.Item>
            {friends.map((friend) => (
              <Dropdown.Item key={friend._id.$oid} eventKey={friend._id.$oid}>
                {friend.username}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
  
        <Dropdown onSelect={(value) => setSelectedDate(value)}>
          <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
          {filterDateLabels[selectedDate] || 'Fecha'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item
                key="ever"
                eventKey="ever"
                style={selectedDate === 'ever' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                >
                Siempre
            </Dropdown.Item>
          <Dropdown.Item
                key="recently"
                eventKey="recently"
                style={selectedDate === 'recently' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                >
                Recientes
            </Dropdown.Item>
            <Dropdown.Item 
                key="today"
                eventKey="today"
                style={selectedDate === 'today' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
            >
              Hoy
            </Dropdown.Item>
            <Dropdown.Item
                key="this_week"
                eventKey="this_week"
                style={selectedDate === 'this_week' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
            >
              Esta semana
            </Dropdown.Item>
            <Dropdown.Item
                key="this_month"
                eventKey="this_month"
                style={selectedDate === 'this_month' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
            >
              Este mes
            </Dropdown.Item>
            <Dropdown.Item
                key="this_year"
                eventKey="this_year"
                style={selectedDate === 'this_year' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
            >
              Este año
            </Dropdown.Item>
            <Dropdown.Item
                key="older"
                eventKey="older"
                style={selectedDate === 'older' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
            >
              Más antiguas
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
  
      <div className="sorting d-flex">
    <Dropdown onSelect={(value) => setSortCriteria(value)}>
      <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
        {sortCriteriaLabels[sortCriteria] || 'Ordenar por'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
            key="created"
            eventKey="created"
            style={sortCriteria === 'created' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
        >
          {sortCriteriaLabels.created}
        </Dropdown.Item>
        <Dropdown.Item
            key="modified"
            eventKey="modified"
            style={sortCriteria === 'modified' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
        >
          {sortCriteriaLabels.modified}
        </Dropdown.Item>
        <Dropdown.Item
            key="title"
            eventKey="title"
            style={sortCriteria === 'title' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
        >
          {sortCriteriaLabels.title}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <ButtonGroup>
      <Button onClick={handleSortDirection}>
        {sortAscending ? 'Ascendente' : 'Descendente'}
      </Button>
    </ButtonGroup>
  </div>
    </div>
  );
}

export default Toolbar;
