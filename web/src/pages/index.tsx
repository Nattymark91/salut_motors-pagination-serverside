import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container, Pagination} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import { useRouter } from "next/router";

const inter = Inter({subsets: ["latin"]});
const limit = 20;

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  response: { rows: TUserItem[], count: number }
  limit: number
  page: number
  count: number
}

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  
  try {
    const { query } = ctx;
    const page = query.page || 1;

    const res = await fetch(`http://localhost:3000/users?page=${page}&limit=${limit}`, {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, response: { rows: [], count: 0 }}}
    }
    return {
      props: {statusCode: 200, response: await res.json()}
    }
  } catch (e) {
    return {props: {statusCode: 500, response: { rows: [], count: 0 }}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, response, }: TGetServerSideProps) {

  let users = response.rows
  const pageCount: number = Math.ceil(response.count / limit)
  const router = useRouter();

  const showPageItemsFunction = () => {
    const pagintionData = [];

    const start = Math.min(Math.max(1, +router.query.page - 4), pageCount - 9)  || 1;
    const end = Math.min(pageCount, start + 9);

    pagintionData.push(
      <Pagination.First
          key="first"
          onClick={() => handlePageClick(1)}
      />
    );

    pagintionData.push(
      <Pagination.Prev
          key="prev"
          onClick={() => handlePageClick(+router.query.page - 1)}
      />
    );
    
    for (let i = start; i <= end; i++) {
      pagintionData.push(
            <Pagination.Item
            key={i}
            active={router.query.page == i}
            onClick={() => handlePageClick(i)}
        >
            {i}
            </Pagination.Item>
        );
    }

    pagintionData.push(
      <Pagination.Next
          key="next"
          onClick={() => handlePageClick(+router.query.page + 1)}
      />
    );

    pagintionData.push(
      <Pagination.Last
          key="last"
          onClick={() => handlePageClick(pageCount)}
      />
    );

    return pagintionData;
  };

  const handlePageClick = (selected: number) => {
    if (selected > 0 && selected <= pageCount)
  router.push(`?page=${selected}`);
  };

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

            <Pagination key="pagination">
            {showPageItemsFunction()}
            </Pagination>

        </Container>
      </main>
    </>
  );
}
