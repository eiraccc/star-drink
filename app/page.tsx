import DrinkList from '../components/DrinkList'
import { fetchReviewsServer } from '../services/reviewServer';

export default async function HomePage() {
  const reviewData = await fetchReviewsServer();
  
  return <DrinkList initReviewData={reviewData}/>
}
