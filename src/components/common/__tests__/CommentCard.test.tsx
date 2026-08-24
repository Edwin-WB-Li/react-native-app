import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CommentCard from '../CommentCard';
import { Comment } from '#/models';

const mockComment: Comment = {
  postId: 1,
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  body: 'This is a great article, thanks for sharing!',
};

describe('CommentCard', () => {
  it('renders comment author name', () => {
    render(<CommentCard comment={mockComment} />);
    expect(screen.getByText('Alice Johnson')).toBeTruthy();
  });

  it('renders comment email', () => {
    render(<CommentCard comment={mockComment} />);
    expect(screen.getByText('alice@example.com')).toBeTruthy();
  });

  it('renders comment body', () => {
    render(<CommentCard comment={mockComment} />);
    expect(
      screen.getByText('This is a great article, thanks for sharing!')
    ).toBeTruthy();
  });

  it('renders avatar with first letter of name', () => {
    render(<CommentCard comment={mockComment} />);
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('renders different avatar letter for different names', () => {
    const comment: Comment = {
      ...mockComment,
      name: 'Bob Smith',
    };
    render(<CommentCard comment={comment} />);
    expect(screen.getByText('B')).toBeTruthy();
  });
});
