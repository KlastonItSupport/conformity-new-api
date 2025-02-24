export const buildPaginationLinks = ({
  data,
  lastPage,
  page,
  pageSize,
  totalData,
}) => {
  return {
    items: data,
    pages: {
      first: 1,
      last: lastPage,
      next: page + 1 > lastPage ? lastPage : page + 1,
      totalPages: pageSize ? Math.ceil(totalData / pageSize) : 1,
      currentPage: pageSize ? Number(page) : 1,
      previous: pageSize ? (page > 1 ? page - 1 : 0) : null,
      totalData,
    },
  };
};
