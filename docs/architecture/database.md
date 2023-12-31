# <i class="fas fa-database"></i> Database

![Logo Supabase](supabase-logo.webp){ align=right }

<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
        Supabase is an open source platform designed to help developers create applications that require backend services and a database. This platform provides a variety of tools and services that enable developers to build web applications and mobile apps more efficiently without having to worry about the complexities of managing and scaling the backend infrastructure.
    </div>
</div>
We decided to use the web-based database technology Supabase because it allows us to access the database directly via the front end using the Supabase API. It also offers auxiliary functions for authentication and server-side pagination.

**important features and details of the Supabase database:**

- <span style="background-color: #0284c7;">**Postgres database**</span>: Supabase is based on PostgreSQL, a powerful open source database. PostgreSQL is known for its reliability, extensibility and scalability. Supabase provides a fully managed PostgreSQL instance, allowing developers to take advantage of this database without the need for time-consuming maintenance tasks.
<br>
- <span style="background-color: #0284c7;">**ACID compliance**</span>: The Supabase database guarantees ACID properties, which stands for Atomicity, Consistency, Isolation and Durability. These properties ensure that transactions in the database are reliable and fault-tolerant.
<br>
- <span style="background-color: #0284c7;">**Scalability**</span>: The Supabase database can be scaled as needed to meet database performance and capacity requirements. This allows developers to focus on developing their applications without worrying about scaling the database.
<br>
- <span style="background-color: #0284c7;">**RESTful API**</span>: Supabase provides a RESTful API that allows developers to access the database. This allows applications to retrieve, add, update and delete data by sending HTTP requests to the API.
<br>
- <span style="background-color: #0284c7;">**Authentication and permissions**</span>: The Supabase database integrates seamlessly with the platform's authentication services. Developers can set fine-grained permissions to control access to data in the database. This facilitates the implementation of secure access rules.
<br>
- <span style="background-color: #0284c7;">**Real-time support**</span>: The database supports Supabase's real-time function, which is based on WebSockets. This makes it possible to send data changes to clients in real time, which is particularly useful when several users are working on the same data at the same time.
<br>
- <span style="background-color: #0284c7;">**Full-text search and indexing**</span>: Full-text search and indexing: The database supports full-text search and indexing, which facilitates the efficient search and retrieval of data in the database.
<br>
---

**The typical structure of a database query in Supabase for PostgreSQL resembles the following:**

<details open>
<summary>Database Query</summary>

```
export async function fetchFilteredEmployees(startNumber, endNumber, filterOne = null, filterTwo = null) {
  try {
    //query to get all employees between two indizes
    let query = supabase.from('employees').select('*').range(startNumber, endNumber);

    // if filterOne and or filterTwo is set add filter to query
    if (filterOne !== null) {
      query = query.filter(filterOne.field, filterOne.operator, filterOne.value);
    }
    if (filterTwo !== null) {
      query = query.filter(filterTwo.field, filterTwo.operator, filterTwo.value);
    }

    // perform query
    const { data, error } = await query;
    // console.log(data);

    if (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
      return [];
    }

    // return statement
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return [];
  }
}

```
</details>





  
