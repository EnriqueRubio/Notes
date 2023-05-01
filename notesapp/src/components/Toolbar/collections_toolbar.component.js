import { Dropdown, ButtonGroup, Button, Form, FormControl, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

function Toolbar({
    setSelectedFriends,
    setSelectedDate,
    setSortCriteria,
    setSortAscending,
    sortAscending,
    setSearchTerm,
    friends,
    sortCriteria,
    selectedDate,
    selectedFriends,
    searchTerm,
}) {

    const handleSortDirection = () => {
        setSortAscending(!sortAscending);
    };

    const sortCriteriaLabels = {
        created: 'Created',
        modified: 'Updated',
        title: 'Title',
    };

    const filterDateLabels = {
        ever: 'Ever',
        recently: 'Recent',
        today: 'Today',
        this_week: 'This week',
        this_month: 'This month',
        this_year: 'This year',
        older: 'Older',
    };

    return (
        <div
            className="toolbar container-fluid"
            style={{ marginLeft: "5px", marginRight: "5px" }}
        >
            <div className="row">
                <div className="filters d-flex col">

                    <Dropdown
                        onSelect={(friendId) => {
                            if (friendId === '') {
                                setSelectedFriends([]);
                                return;
                            }
                            const friendIndex = selectedFriends.findIndex((friend) => friend._id.$oid === friendId);
                            if (friendIndex === -1) {
                                // Agrega el amigo a selectedFriends
                                const selected = friends.find((friend) => friend._id.$oid === friendId);
                                setSelectedFriends([...selectedFriends, selected]);
                            } else {
                                // Elimina el amigo de selectedFriends
                                setSelectedFriends(selectedFriends.filter((_, index) => index !== friendIndex));
                            }
                        }}
                    >
                        <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
                            {selectedFriends.length > 0 ? `${selectedFriends.length} Friend(s)` : 'Shared with'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item key="all" eventKey="" active={selectedFriends.length === 0}>
                                All
                            </Dropdown.Item>
                            {friends.map((friend) => (
                                <Dropdown.Item
                                    key={friend._id.$oid}
                                    eventKey={friend._id.$oid}
                                    active={selectedFriends.some((selectedFriend) => selectedFriend._id.$oid === friend._id.$oid)}
                                >
                                    {friend.username}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown onSelect={(value) => setSelectedDate(value)}>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
                            {filterDateLabels[selectedDate] || 'Date'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                key="ever"
                                eventKey="ever"
                                style={selectedDate === 'ever' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                Ever
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="recently"
                                eventKey="recently"
                                style={selectedDate === 'recently' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                Recent
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="today"
                                eventKey="today"
                                style={selectedDate === 'today' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                Today
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="this_week"
                                eventKey="this_week"
                                style={selectedDate === 'this_week' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                This week
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="this_month"
                                eventKey="this_month"
                                style={selectedDate === 'this_month' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                This month
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="this_year"
                                eventKey="this_year"
                                style={selectedDate === 'this_year' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                This year
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="older"
                                eventKey="older"
                                style={selectedDate === 'older' ? { backgroundColor: '#4285F4', fontWeight: "bold" } : {}}
                            >
                                Older
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form className="d-flex" style={{ flexGrow: 1 }}>
                        <FormControl
                            type="search"
                            placeholder="Search by collection title"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </Form>
                </div>

                <div className="sorting d-flex col-auto">
                    <Dropdown onSelect={(value) => setSortCriteria(value)}>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic" className="mx-2">
                            {sortCriteriaLabels[sortCriteria] || 'Order by'}
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
                        <Button onClick={handleSortDirection} className="mx-2">
                            {sortAscending ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;
