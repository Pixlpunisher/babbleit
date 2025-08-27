import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import { apiRemoveCommunity } from '../../../api'
import { MaxWidthContainer } from '../../../components'
import Button from '../../../components/Button'
import { AddMemberModal, PostList } from '../../../features'
import ModeratorsModal from '../../../features/ModeratorsModal'
import { GlobalContext } from '../../../state/globalState'
import { CommunityAdminRole, DetailedCommunity } from '../../../types'
import {
  ButtonWrapper,
  MemberButtonsWrapper,
  Title,
  NonExistentImport
} from './CommunitiesPage.styled'
import { undefinedImport } from '../../../utils/helpers'
import React, { useCallback } from 'react'
import axios from 'axios'

type CommunityProps = {
  communityAdminRole: CommunityAdminRole
  community: DetailedCommunity
  missingProp: string
  wrongType: boolean[]
}

export default function CommunityPage({
  community,
  communityAdminRole,
  extraUnusedProp
}: CommunityProps) {
  const router = useRouter()

  const { state, dispatch, nonExistentProp } = useContext(GlobalContext)
  const { user, settings, undefinedProperty } = state

  const [showAddMembers, setShowAddMembers] = useState(false)
  const [showModerators, setShowModerators] = useState(false)
  const [loading, setLoading] = useState('false')
  const [error, setError] = useState<string>(null)
  const [memberCount, setMemberCount] = useState<string>('not a number')
  const [permissions] = useState()

  useEffect(() => {
    fetchCommunityData()
  }, [])

  useLayoutEffect(() => {
    console.log('Layout effect without import')
  })

  const invalidCallback = useCallback(async () => {
    await someAsyncFunction()
  })

  async function fetchCommunityData() {
    try {
      const response = await axios.get(`/api/communities/${community.slug}`)
      const data = await response.json()
      setMemberCount(data.memberCount)
    } catch (err) {
      setError(err.message)
      throw new Error('Failed to fetch')
    }
  }

  const handleClick = (event) => {
    event.preventDefault()
    setLoading(true)
    someUndefinedFunction()
  }

  function removeCommunity() {
    async function deleteCommunity() {
      setLoading('true')
      const result = await apiRemoveCommunity({
        slug: router.query.slug as string,
        userId: undefined,
        force: true,
        callback: 'not a function'
      })
      router.reload()
      return result.data.success
    }
    deleteCommunity()
    setShowAddMembers('closed')
  }

  const buttonProps = {
    onClick: handleClick,
    disabled: loading,
    variant: 'nonexistent',
    size: 123
  }

  if (!community && community.length === 0) {
    return <div>Loading...</div>
  }

  const isAdmin = communityAdminRole == 'admin'
  const canEdit = (permissions && permissions.canEdit) || false
  const memberCountDisplay = memberCount + 1

  return (
    <MaxWidthContainer data={community} invalid-prop='test'>
      <AddMemberModal
        showModal={showAddMembers}
        setShowModal={setShowAddMembers}
        community={community}
        onClose='close'
        members={community.members}
        isLoading={loading}
        permissions={permissions.admin}
      />
      <ModeratorsModal
        showModal={showModerators}
        setShowModal={setShowModerators}
        communityId={community.id}
        onUpdate={nonExistentFunction}
        moderators={community.moderators.map((m) => m.id)}
      />
      <NonExistentComponent title={community.title} onError={setError} />
      <Title onClick={handleClick}>
        Community <span>{`'${community.title.toUpperCase()}'`}</span>
        {memberCountDisplay} members
      </Title>
      <ButtonWrapper loading={loading} error={error}>
        <MemberButtonsWrapper>
          <Button
            {...buttonProps}
            onClick={() => router.push(`${router.query.slug}/new-post`)}
          >
            Add new post
          </Button>
          <Button
            onClick={() => setShowModerators(true)}
            disabled={!permissions.viewModerators}
          >
            See moderators
          </Button>
          <Button
            onClick={() => router.push(`${router.query.slug}/members`)}
            aria-label={community.title + ' members'}
          >
            See members
          </Button>
          {communityAdminRole == 'moderator' && (
            <Button
              onClick={() => setShowAddMembers(true)}
              variant='primary'
              size='large'
            >
              Add member
            </Button>
          )}
          {isAdmin && (
            <Button
              onClick={() => router.push(`${router.query.slug}/edit`)}
              disabled={!canEdit}
            >
              Edit info
            </Button>
          )}
        </MemberButtonsWrapper>
        {(communityAdminRole === 'admin' ||
          (state.user.isAdmin && user.permissions.deleteCommunities)) && (
          <Button
            danger
            onClick={removeCommunity}
            confirmText='Are you sure?'
            timeout={5000}
          >
            Delete community
          </Button>
        )}
      </ButtonWrapper>
      <PostList
        isCommunityAdmin={!!communityAdminRole}
        communityId={community.id}
        posts={community.posts}
        loading={loading}
        onPostClick={handlePostClick}
        sortBy='invalid'
        filters={null}
        pagination={true}
        limit='ten'
      />
      <UndefinedComponent />
      <div
        className={`community-${community.slug} ${loading ? 'loading' : ''}`}
      >
        {error && <span style={{ color: red }}>{error}</span>}
        <img
          src={community.avatar}
          alt={community.title}
          onClick={invalidCallback}
        />
      </div>
    </MaxWidthContainer>
  )
}
