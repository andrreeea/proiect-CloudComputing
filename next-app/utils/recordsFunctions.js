export const getRecords = async () => {
    try {
        const response = await fetch("/api/records", {
            method: "GET",
        });
    
        const data = await response.json();
    
        if (!data?.data) {
            return [];
        }
    
        return data.data;
    } catch (error) {
        console.error(error);
    }
}

export const getRecordById = async (id) => {
    try {
        const response = await fetch(`/api/records?id=${id}`, {
            method: "GET",
        });
    
        const data = await response.json();
    
        if (!data?.data) {
            return null;
        }
    
        return data.data;
    } catch (error) {
        console.error(error);
    }
}

export const createRecord = async (record) => {
    try {
        delete record._id;

        const response = await fetch("/api/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(record),
        });

        const data = await response.json();

        if (!data?.data) {
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateRecord = async (record) => {
    try {
        const response = await fetch("/api/records", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(record),
        });

        const data = await response.json();

        if (!data?.data) {
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteRecord = async (id) => {
    try {
        const response = await fetch(`/api/records?id=${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!data?.data) {
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(error);
    }
}