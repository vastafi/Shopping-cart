
/**
 * Generating unique ID for new Input
 */
function guid() {
    return parseInt(Date.now() + Math.random());
}

/**
 * Create and Store New Member
 */
function saveMemberInfo() {
    const keys = ['name', 'author', 'description', 'price', 'category'];
    const obj = {};

    keys.forEach(function (item, index) {
        const result = document.getElementById(item).value;
        if (result) {
            obj[item] = result;
        }
    })

    let members = getMembers();

    if (!members.length) {
        $('.show-table-info').addClass('hide');
    }

    if (Object.keys(obj).length) {
        members = getMembers();
        obj.id = guid();
        members.push(obj);
        const data = JSON.stringify(members);
        localStorage.setItem("members", data);
        clearFields();
        insertIntoTableView(obj, getTotalRowOfTable());
        $('#addnewModal').modal('hide')
    }
}

/**
 * Clear Create New Member Form Data0
 */
function clearFields() {
    $('#input_form')[0].reset();
}

/**
 * Get All Members already stored into the local storage
 */
function getMembers() {
    const memberRecord = localStorage.getItem("members");
    let members = [];
    if (!memberRecord) {
        return members;
    } else {
        members = JSON.parse(memberRecord);
        return members;
    }
}

/**
 * Populating Table with stored data
 */
function getTableData() {
    $("#member_table").find("tr:not(:first)").remove();

    const searchKeyword = $('#member_search').val();
    const members = getFormattedMembers();

    const filteredMembers = members.filter(function (item, index) {
        return item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.author.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.price.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.category.toLowerCase().includes(searchKeyword.toLowerCase())
    });

    if (!filteredMembers.length) {
        $('.show-table-info').removeClass('hide');
    } else {
        $('.show-table-info').addClass('hide');
    }

    filteredMembers.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}

/**
 * Inserting data into the table of the view
 *
 * @param {object} item
 * @param {int} tableIndex
 */
function insertIntoTableView(item, tableIndex) {
    const table = document.getElementById('member_table');
    const row = table.insertRow();
    const idCell = row.insertCell(0);
    const nameCell = row.insertCell(1);
    const authorCell = row.insertCell(2);
    const descriptionCell = row.insertCell(3);
    const priceCell = row.insertCell(4);
    const categoryCell = row.insertCell(5);
    const actionCell = row.insertCell(6);

    idCell.innerHTML = tableIndex;
    nameCell.innerHTML = item.name;
    authorCell.innerHTML = item.author;
    descriptionCell.innerHTML = item.description;
    priceCell.innerHTML = item.price;
    categoryCell.innerHTML = '<a class="tag">'+item.category+'</a>'
    const guid = item.id;

    actionCell.innerHTML = '<button class="btn btn-sm btn-default" onclick="showMemberData(' + guid + ')">View</button> ' +
        '<button class="btn btn-sm btn-primary" onclick="showEditModal(' + guid + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="showDeleteModal(' + guid + ')">Delete</button>';
}


/**
 * Get Total Row of Table
 */
function getTotalRowOfTable() {
    const table = document.getElementById('member_table');
    return table.rows.length;
}

/**
 * Show Single Member Data into the modal
 *
 * @param {string} id
 */
function showMemberData(id) {
    const allMembers = getMembers();
    const member = allMembers.find(function (item) {
        return item.id === id;
    });

    $('#show_name').val(member.name);
    $('#show_author').val(member.author);
    $('#show_description').val(member.description);
    $('#show_price').val(member.price);
    $('#show_category').val(member.category);

    $('#showModal').modal();

}


/**
 * Show Edit Modal of a single member
 *
 * @param {string} id
 */
function showEditModal(id) {
    const allMembers = getMembers();
    const member = allMembers.find(function (item) {
        return item.id === id;
    });

    $('#edit_name').val(member.name);
    $('#edit_author').val(member.author);
    $('#edit_description').val(member.description);
    $('#edit_price').val(member.price);
    $('#edit_category').val(member.category);
    $('#member_id').val(id);

    $('#editModal').modal();
}


/**
 * Store Updated Member Data into the storage
 */
function updateMemberData() {

    const allMembers = getMembers();
    const memberId = $('#member_id').val();

    const member = allMembers.find(function (item) {
        return item.id === memberId;
    });

    member.name = $('#edit_name').val();
    member.author = $('#edit_author').val();
    member.description = $('#edit_description').val();
    member.price = $('#edit_price').val();
    member.category = $('#edit_category').val();

    const data = JSON.stringify(allMembers);
    localStorage.setItem('members', data);

    $("#member_table").find("tr:not(:first)").remove();
    getTableData();
    $('#editModal').modal('hide')
}

/**
 * Show Delete Confirmation Dialog Modal
 *
 * @param {int} id
 */
function showDeleteModal(id) {
    $('#deleted-member-id').val(id);
    $('#deleteDialog').modal();
}

/**
 * Delete single member
 */
function deleteMemberData() {
    const id = $('#deleted-member-id').val();
    const allMembers = getMembers();

    const storageUsers = JSON.parse(localStorage.getItem('members'));

    let newData = [];

    newData = storageUsers.filter(function (item, index) {
        return item.id !== id;
    });

    const data = JSON.stringify(newData);

    localStorage.setItem('members', data);
    $("#member_table").find("tr:not(:first)").remove();
    $('#deleteDialog').modal('hide');
    getTableData();

}