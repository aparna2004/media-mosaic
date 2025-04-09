import { useState, useEffect } from 'react';
import { Categories } from '@/types/categories';
import { categoriesService } from '@/services/categories.service';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config/api';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';

export function PreferencesSelector() {
  // State for multiple preference types
  const [categories, setCategories] = useState<Categories | null>(null);
  const [selectedNewsPreferences, setSelectedNewsPreferences] = useState<string[]>([]);
  const [selectedSportsPreferences, setSelectedSportsPreferences] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("news");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    console.log('Current user:', user);

    if (!token || !user) {
      console.log('No authentication found, redirecting to login...');
      navigate('/login');
      return;
    }

    const loadCategories = async () => {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data);
  
        setSelectedNewsPreferences(['current']);
        setSelectedSportsPreferences(['indian']);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [navigate, user]);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token not found, redirecting to login...');
        navigate('/login');
        return;
      }
      

      const requestBody = {
        news: selectedNewsPreferences,
        sports: selectedSportsPreferences
      };

      console.log('Sending preferences:', JSON.stringify(requestBody, null, 2));
      
  
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/set-preferences`,
          requestBody,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        console.log('Preferences saved successfully, response:', data);
        return data;
      } catch (error) {
        console.error('Error saving preferences:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response:', error.response?.data);
          console.error('Status:', error.response?.status);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation success, navigating home');
      navigate('/');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const handleNewsPreferenceChange = (category: string, checked: boolean) => {
    setSelectedNewsPreferences(prev => {
      if (checked) {
        return [...prev, category];
      }
      return prev.filter(p => p !== category);
    });
  };

  const handleSportsPreferenceChange = (category: string, checked: boolean) => {
    setSelectedSportsPreferences(prev => {
      if (checked) {
        return [...prev, category];
      }
      return prev.filter(p => p !== category);
    });
  };

  const handleSavePreferences = () => {
    console.log('Save button clicked, current selections:', {
      news: selectedNewsPreferences,
      sports: selectedSportsPreferences
    });
    mutation.mutate();
  };

  if (!categories) return null;

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-serif font-bold mb-4">Content Preferences</h2>
        
        <Tabs defaultValue="news" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="news">News Sources</TabsTrigger>
            <TabsTrigger value="sports">Sports Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-4">
            {categories.news.map((category) => (
              <div key={category} className="flex items-center space-x-3">
                <Checkbox
                  id={`news-${category}`}
                  checked={selectedNewsPreferences.includes(category)}
                  onCheckedChange={(checked) => 
                    handleNewsPreferenceChange(category, checked as boolean)
                  }
                />
                <label
                  htmlFor={`news-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.toUpperCase()}
                </label>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="sports" className="space-y-4">
            {categories.sports.map((category) => (
              <div key={category} className="flex items-center space-x-3">
                <Checkbox
                  id={`sports-${category}`}
                  checked={selectedSportsPreferences.includes(category)}
                  onCheckedChange={(checked) => 
                    handleSportsPreferenceChange(category, checked as boolean)
                  }
                />
                <label
                  htmlFor={`sports-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.toUpperCase()}
                </label>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleSavePreferences}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
