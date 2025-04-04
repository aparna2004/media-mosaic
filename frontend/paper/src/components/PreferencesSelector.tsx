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

export function PreferencesSelector() {
  const [categories, setCategories] = useState<Categories | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check authentication first
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
        setSelectedPreferences(['current']);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [navigate, user]);

  const mutation = useMutation({
    mutationFn: async (preferences: string[]) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token not found, redirecting to login...');
        navigate('/login');
        return;
      }
      const requestBody = { newsArray: preferences };

      const response = await fetch(`${API_BASE_URL}/set-news-preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Preferences saved successfully:', data);
      navigate('/');
    },
    onError: (error) => {
      console.error('Failed to save preferences:', error);
    }
  });

  const handlePreferenceChange = (category: string, checked: boolean) => {
    setSelectedPreferences(prev => {
      if (checked) {
        return [...prev, category];
      }
      return prev.filter(p => p !== category);
    });
  };

  if (!categories) return null;

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-serif font-bold mb-4">News Source Preferences</h2>
        <div className="space-y-4">
          {categories.news.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={category}
                checked={selectedPreferences.includes(category)}
                onCheckedChange={(checked) => 
                  handlePreferenceChange(category, checked as boolean)
                }
              />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.toUpperCase()}
              </label>
            </div>
          ))}
        </div>
        <Button 
          className="w-full mt-6" 
          onClick={() => mutation.mutate(selectedPreferences)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
