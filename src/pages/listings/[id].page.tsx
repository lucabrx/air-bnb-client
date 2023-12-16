import { useListing } from "~/hooks/query/use-listing"

type ServerSideProps = {
  query: {
    id: "string"
  }
}

export function getServerSideProps({ query }: ServerSideProps) {
  return {
    props: { query },
  }
}

export default function ListingPage({ query }: ServerSideProps) {
  const { listing } = useListing(query.id)
  console.log(listing)
  return (
    <div>
      <h1>Listing {query.id}</h1>
    </div>
  )
}
