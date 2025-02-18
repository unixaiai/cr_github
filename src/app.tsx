import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/layout.tsx';

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as any;

const routes = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes('$')
    ? fileName.replace('$', ':')
    : fileName.replace(/\/index/, '');

  routes.push({
    path: fileName === 'index' ? '/' : `/${normalizedPathName.toLowerCase()}`,
    Element: pages[path].default,
    loader: pages[path]?.loader,
    action: pages[path]?.action,
    ErrorBoundary: pages[path]?.ErrorBoundary,
  });
}

const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    element: (
      <Layout>
        <Element />
      </Layout>
    ),
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  })),
);

export default () => <RouterProvider router={router}></RouterProvider>;
