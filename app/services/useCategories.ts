


/*
const useCategories = (userId: string) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);

    if (data) setCategories(data);
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...categoryData,
        user_id: userId,
        is_default: false
      })
      .select();

    if (data) setCategories(prev => [...prev, data[0]]);
  };

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  return { categories, createCategory };
};*/
